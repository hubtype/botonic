#!/bin/bash

# Helper function to version and publish a package
version_and_publish() {
  local package_dir=$1
  local new_version=$2
  local package_name=$(basename "$package_dir")
  
  cd "$package_dir"
  
  if npm version $new_version 2>&1 | grep -q "Version not changed"; then
    echo "Version not changed for $package_name, skipping publish"
    cd - > /dev/null
    return 1
  else
    echo "Publishing $package_name"
    npm publish
    cd - > /dev/null
    return 0
  fi
}

# Find the highest version across all packages
find_highest_version() {
  local highest_version="0.0.0"
  
  for pkg_dir in packages/*; do
    if [ -d "$pkg_dir" ] && [ -f "$pkg_dir/package.json" ]; then
      local pkg_version=$(cd $pkg_dir && node -p "require('./package.json').version")
      
      # Parse the version numbers
      local highest_fixed=$(echo $highest_version | cut -d. -f1)
      local highest_major=$(echo $highest_version | cut -d. -f2)
      local highest_minor=$(echo $highest_version | cut -d. -f3)
      
      local pkg_fixed=$(echo $pkg_version | cut -d. -f1)
      local pkg_major=$(echo $pkg_version | cut -d. -f2)
      local pkg_minor=$(echo $pkg_version | cut -d. -f3)
      
      # Check if package version is higher
      local is_higher=false
      
      if [ "$pkg_fixed" -gt "$highest_fixed" ]; then
        is_higher=true
      elif [ "$pkg_fixed" -eq "$highest_fixed" ]; then
        if [ "$pkg_major" -gt "$highest_major" ]; then
          is_higher=true
        elif [ "$pkg_major" -eq "$highest_major" ]; then
          if [ "$pkg_minor" -gt "$highest_minor" ]; then
            is_higher=true
          fi
        fi
      fi
      
      if [ "$is_higher" = "true" ]; then
        highest_version=$pkg_version
      fi
    fi
  done
  
  echo $highest_version
}

# Get version from botonic-core
get_core_version() {
  cd packages/botonic-core
  node -p "require('./package.json').version"
}

# Calculate new version based on current version and type
calculate_new_version() {
  local current_version=$1
  local version_type=$2
  
  # Extract version components
  local fixed=$(echo $current_version | cut -d. -f1)
  local major=$(echo $current_version | cut -d. -f2)
  local minor=$(echo $current_version | cut -d. -f3)
  
  if [[ "$version_type" == "major" ]]; then
    local new_major=$((major + 1))
    echo "${fixed}.${new_major}.0"
  else
    local new_minor=$((patch + 1))
    echo "${fixed}.${major}.${new_minor}"
  fi
}

# Process single botonic dependency
process_botonic_dependency() {
  local dep_name=$1
  local new_version=$2
  
  if [ -d "packages/$dep_name" ]; then
    echo "Processing dependency: $dep_name"
        
    # Version and publish
    version_and_publish "packages/$dep_name" "$new_version"
  else
    echo "Dependency package $dep_name not found in packages directory"
  fi
}

# Update internal botonic dependencies for a package
update_botonic_dependencies() {
  local package_name=$1
  local new_version=$2
  
  cd packages/$package_name
  
  # Check if package.json has any @botonic dependencies
  if grep -q "\"@botonic/" package.json; then
    echo "Updating @botonic dependencies in $package_name to version $new_version"
    # Update all @botonic/* dependencies to the new version
    sed -i -E "s/(\"@botonic\/[^\"]+\"\\s*:\\s*\")[^\"]+(\",?)/\\1^$new_version\\2/g" package.json
    
    # Get the list of all botonic dependencies in this package, excluding the current package
    local package_basename=${package_name#botonic-}
    local botonic_deps=$(grep -o '"@botonic/[^"]*"' package.json | tr -d '"' | grep -v "^@botonic/$package_basename$")
    
    # Process each dependency
    cd ../..
    for dep in $botonic_deps; do
      # Extract the package name from the dependency (remove @botonic/)
      local dep_name=${dep#@botonic/}
      
      # Skip if it's the current package (exact match check)
      if [ "botonic-$dep_name" != "$package_name" ]; then
        process_botonic_dependency "botonic-$dep_name" "$new_version"
      else
        echo "Skipping self-dependency: $dep"
      fi
    done
    
    # Return to the original package
    cd packages/$package_name
  else
    echo "No @botonic dependencies found in $package_name"
  fi
  
  cd ../..
}

# Build and version examples
version_and_publish_examples() {
  local new_version=$1
  
  # Check if examples folder exists
  if [ -d "examples" ]; then
    echo "Building and versioning examples"
    for EXAMPLE_DIR in examples/*; do
      if [ -d "$EXAMPLE_DIR" ] && [ -f "$EXAMPLE_DIR/package.json" ]; then
        echo "Processing example: $(basename $EXAMPLE_DIR)"
        
        # Update Botonic dependencies in the example
        if grep -q "\"@botonic/" "$EXAMPLE_DIR/package.json"; then
          echo "Updating @botonic dependencies in $(basename $EXAMPLE_DIR) to version $new_version"
          # Update all @botonic/* dependencies to the new version
          sed -i -E "s/(\"@botonic\/[^\"]+\"\\s*:\\s*\")[^\"]+(\",?)/\\1^$new_version\\2/g" "$EXAMPLE_DIR/package.json"
        fi
        
        # Build the example
        build_package "$EXAMPLE_DIR"
        
        # Version and publish
        version_and_publish "$EXAMPLE_DIR" "$new_version"

        
      fi
    done
  fi
}

# Deploy a single package
deploy_package() {
  local package_name=$1
  local new_version=$2
  
  echo "Deploying package: $package_name @ version $new_version"
  
  # 1. Update dependencies
  update_botonic_dependencies "$package_name" "$new_version"
    
  # 2. Version and publish
  version_and_publish "packages/$package_name" "$new_version"
} 
#!/bin/sh
aws-mfa

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}Deploying webchat to s3...${NC}"

existingFolder=$(aws --profile bots-admin s3api head-object --bucket webchat-clients --key bot_name/)
PACKAGE_JSON_PATH="./package.json"
VERSION_FILE="./version.txt"

read_version_from_package () {
    if [[ -f "$PACKAGE_JSON_PATH" ]]; then
        VERSION=$(grep '"version"' "$PACKAGE_JSON_PATH" | sed -E 's/.*"version": *"([^"]*)".*/\1/')
        if [[ -z "$VERSION" ]]; then
            echo -e "${RED}Version not found in $PACKAGE_JSON_PATH${NC}"
            exit 1
        else
            echo "$VERSION"
        fi
    else
        echo -e "${RED}package.json not found at $PACKAGE_JSON_PATH${NC}"
        exit 1
    fi
}

get_s3_version () {
    S3_VERSION=$(aws --profile bots-admin s3 cp s3://webchat-clients/bot_name/webchat_version - 2>/dev/null)
    echo "$S3_VERSION"
}

create_version_file () {
    echo "$WEBCHAT_VERSION" > "$VERSION_FILE"
}

s3_sync () {
    WEBCHAT_VERSION=$(read_version_from_package)
    echo -e "${GREEN}Webchat version: $WEBCHAT_VERSION${NC}"
    create_version_file

    echo -e "${BLUE}Deploying webchat: bot_name${NC}"

    aws --profile bots-admin s3 cp ./dist/webchat.botonic.js s3://webchat-clients/bot_name/
    aws --profile bots-admin s3 cp ./dist/webchat.botonic.js s3://webchat-clients/bot_name/$WEBCHAT_VERSION.webchat.botonic.js
    aws --profile bots-admin s3 cp ./dist/webchat-button.botonic.js s3://webchat-clients/bot_name/
    aws --profile bots-admin s3 cp ./dist/webchat-button.botonic.js s3://webchat-clients/bot_name/$WEBCHAT_VERSION.webchat-button.botonic.js
    aws --profile bots-admin s3 cp "$VERSION_FILE" s3://webchat-clients/bot_name/webchat_version
    aws --profile bots-admin s3 sync ./dist/assets s3://webchat-clients/bot_name/assets/
    aws --profile bots-admin cloudfront create-invalidation --distribution-id E3OMQG2GJT650F --paths "/bot_name/webchat.botonic.js" "/bot_name/$WEBCHAT_VERSION.webchat.botonic.js" "/bot_name/webchat-button.botonic.js" "/bot_name/$WEBCHAT_VERSION.webchat-button.botonic.js" "/bot_name/webchat_version" "/bot_name/assets/*"
    echo -e "${GREEN}Files copied to webchat-clients bucket and CloudFront invalidation created!${NC}"

    rm "$VERSION_FILE"
}

WEBCHAT_VERSION=$(read_version_from_package)
S3_VERSION=$(get_s3_version)

if [ -z "$existingFolder" ]; then
    echo -e "${YELLOW}Creating bot_name folder in webchat-clients bucket...${NC}"
    aws --profile bots-admin s3api put-object --bucket webchat-clients --key bot_name/
    s3_sync
else
    echo -e "${YELLOW}The folder bot_name already exists in webchat-clients bucket.${NC}"
    read -p "Are you sure you want to proceed with the deploy [y/n]? " REPLY
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}Deployment canceled.${NC}"
        exit 0
    fi

    if [ "$WEBCHAT_VERSION" = "$S3_VERSION" ]; then
        echo -e "${YELLOW}The version in S3 ($S3_VERSION) matches the local version ($WEBCHAT_VERSION).${NC}"
        read -p "Do you want to deploy the same version? [y/n]: " CONFIRM
        if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
            echo -e "${RED}Deployment canceled.${NC}"
            exit 0
        fi
    else
        echo -e "${GREEN}Different version detected. Deploying new version.${NC}"
    fi

    s3_sync
fi

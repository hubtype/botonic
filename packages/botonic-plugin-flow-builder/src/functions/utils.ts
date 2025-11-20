import {
  HtFunctionArgument,
  HtFunctionArguments,
} from '../content-fields/hubtype-fields'

export function getArgumentsByLocale(
  args: HtFunctionArguments[],
  locale: string
): HtFunctionArgument[] {
  let resultArguments: HtFunctionArgument[] = []
  for (const arg of args) {
    if ('locale' in arg && arg.locale === locale) {
      resultArguments = [...resultArguments, ...arg.values]
    }
    if ('type' in arg) {
      resultArguments = [...resultArguments, arg]
    }
  }

  return resultArguments
}

export const UPDATE_INPUT_VALUE = 'UPDATE_INPUT_VALUE';

export function updateDelayValue(field, val) {
  return {
    type: UPDATE_INPUT_VALUE,
    field: field,
    val: val
  };
}

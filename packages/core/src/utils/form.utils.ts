import _ from "lodash";
import { FormFieldModel } from "@spark/eslint-config";

import { valueOrUndefined } from "./data.utils";

export const reduceToInitialValues = <Name extends string = string>(fields: FormFieldModel<Name>[]) => {
  return _.reduce(fields, (result, field) => ({ ...result, [getCleanedFieldName(field.name)]: field.value }), {});
};

export const getCleanedFieldName = (fieldName: string) => _.replace(_.replace(fieldName, "['", ""), "']", "");

export const getResourceFields = <Name extends string = string>(
  fields: FormFieldModel<Name>[],
  resource: any,
  disabledFields?: string[],
  hiddenFieldNames?: string[]
): FormFieldModel<Name>[] => {
  return _.reduce(
    fields,
    (result: FormFieldModel<Name>[], field: FormFieldModel<Name>) => {
      return [
        ...result,
        {
          ...field,
          value: valueOrUndefined(
            field.input_type,
            _.get(resource || {}, getCleanedFieldName(field.name), field.value),
            field.value
          ),
          disabled: field.disabled ? true : (disabledFields || []).includes(getCleanedFieldName(field.name)),
          hidden: field.hidden ? true : (hiddenFieldNames || []).includes(getCleanedFieldName(field.name)),
        },
      ];
    },
    [] as FormFieldModel<Name>[]
  );
};

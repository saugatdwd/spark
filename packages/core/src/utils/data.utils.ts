import _ from "lodash";
import dayjs from "dayjs";

export const valueOrUndefined = (fieldType: string, value: any, defaultValue: any) => {
  if (_.isNull(value) || _.isUndefined(value)) {
    return defaultValue || undefined;
  } else {
    if (fieldType === "date") {
      if (value === "") {
        return defaultValue || undefined;
      }

      return dayjs(value, "YYYY-MM-DD").format("YYYY-MM-DD");
    } else {
      return value;
    }
  }
};

export const extractFirstAndLastNameFromFullName = (fullName: string): { firstName: string; lastName: string } => {
  if (!fullName) return { firstName: "", lastName: "" };

  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ") || "";

  return { firstName, lastName };
};
export const getInitalsFromName = (fullName: string) => {
  return fullName
    ?.toUpperCase()
    ?.split(" ")
    .slice(0, 2)
    .map((item) => item[0])
    .join("");
};

export const getInitials = (name: string | undefined) => {
  if (name === undefined) return undefined;
  if (!name.trim()) return "";

  const words = name.trim().split(/\s+/);
  return words
    .map((word) => word[0].toUpperCase())
    .join("")
    .slice(0, 3);
};

export const mapListToDropdown = <T>(list: T[], text: (keyof T)[], value: (keyof T)[], hiddenValue?: keyof T) => {
  const newDropdownList = list?.map((item) => {
    if (!item) return;

    if (hiddenValue) {
      return {
        text: `${item[text[0]]}${item[text[1]] ? ` ${item[text[1]]}` : ""}`,
        value: item[value[0]]?.toString(),
        hiddenValue: item[hiddenValue],
      };
    } else {
      return {
        text: `${item[text[0]]}${item[text[1]] ? ` ${item[text[1]]}` : ""}`,
        value: item[value[0]]?.toString(),
      };
    }
  });
  return newDropdownList as { text: string; value: string }[];
};

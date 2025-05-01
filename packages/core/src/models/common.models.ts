export type ID = undefined | string;

export type TDataWithId = {
  id: ID;
};

export type CurrentIdentity = {
  identity: {
    uuid: ID;
    name: string;
  };
  token: string;
  refreshToken: string;
};

export type BaseModel = TDataWithId;

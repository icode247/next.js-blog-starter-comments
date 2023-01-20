import {
    Field,
    PrimaryKey,
    TigrisCollection,
    TigrisDataTypes,
  } from "@tigrisdata/core";
  
  @TigrisCollection("comments")
  export class Comments {
    @PrimaryKey(TigrisDataTypes.INT32, { order: 1, autoGenerate: true })
    id!: number;
  
    @Field()
    name: string;
  
    @Field()
    content: string;
  
    @Field(TigrisDataTypes.DATE_TIME)
    date: string;
  }
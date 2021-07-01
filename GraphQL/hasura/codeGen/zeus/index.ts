/* eslint-disable */

import { AllTypesProps, ReturnTypes } from './const';
type ZEUS_INTERFACES = never
type ZEUS_UNIONS = never

export type ValueTypes = {
	/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
	["String_comparison_exp"]: {
		_eq?: string,
		_gt?: string,
		_gte?: string,
		/** does the column match the given case-insensitive pattern */
		_ilike?: string,
		_in?: string[],
		/** does the column match the given POSIX regular expression, case insensitive */
		_iregex?: string,
		_is_null?: boolean,
		/** does the column match the given pattern */
		_like?: string,
		_lt?: string,
		_lte?: string,
		_neq?: string,
		/** does the column NOT match the given case-insensitive pattern */
		_nilike?: string,
		_nin?: string[],
		/** does the column NOT match the given POSIX regular expression, case insensitive */
		_niregex?: string,
		/** does the column NOT match the given pattern */
		_nlike?: string,
		/** does the column NOT match the given POSIX regular expression, case sensitive */
		_nregex?: string,
		/** does the column NOT match the given SQL regular expression */
		_nsimilar?: string,
		/** does the column match the given POSIX regular expression, case sensitive */
		_regex?: string,
		/** does the column match the given SQL regular expression */
		_similar?: string
	};
	/** columns and relationships of "follows" */
	["follows"]: AliasType<{
		created_at?: true,
		follower_id?: true,
		updated_at?: true,
		/** An object relationship */
		user?: ValueTypes["users"],
		/** An object relationship */
		userByUserId?: ValueTypes["users"],
		user_id?: true,
		__typename?: true
	}>;
	/** aggregated selection of "follows" */
	["follows_aggregate"]: AliasType<{
		aggregate?: ValueTypes["follows_aggregate_fields"],
		nodes?: ValueTypes["follows"],
		__typename?: true
	}>;
	/** aggregate fields of "follows" */
	["follows_aggregate_fields"]: AliasType<{
		count?: [{ columns?: ValueTypes["follows_select_column"][], distinct?: boolean }, true],
		max?: ValueTypes["follows_max_fields"],
		min?: ValueTypes["follows_min_fields"],
		__typename?: true
	}>;
	/** order by aggregate values of table "follows" */
	["follows_aggregate_order_by"]: {
		count?: ValueTypes["order_by"],
		max?: ValueTypes["follows_max_order_by"],
		min?: ValueTypes["follows_min_order_by"]
	};
	/** input type for inserting array relation for remote table "follows" */
	["follows_arr_rel_insert_input"]: {
		data: ValueTypes["follows_insert_input"][]
	};
	/** Boolean expression to filter rows from the table "follows". All fields are combined with a logical 'AND'. */
	["follows_bool_exp"]: {
		_and?: ValueTypes["follows_bool_exp"][],
		_not?: ValueTypes["follows_bool_exp"],
		_or?: ValueTypes["follows_bool_exp"][],
		created_at?: ValueTypes["timestamptz_comparison_exp"],
		follower_id?: ValueTypes["uuid_comparison_exp"],
		updated_at?: ValueTypes["timestamptz_comparison_exp"],
		user?: ValueTypes["users_bool_exp"],
		userByUserId?: ValueTypes["users_bool_exp"],
		user_id?: ValueTypes["uuid_comparison_exp"]
	};
	/** input type for inserting data into table "follows" */
	["follows_insert_input"]: {
		created_at?: ValueTypes["timestamptz"],
		follower_id?: ValueTypes["uuid"],
		updated_at?: ValueTypes["timestamptz"],
		user?: ValueTypes["users_obj_rel_insert_input"],
		userByUserId?: ValueTypes["users_obj_rel_insert_input"],
		user_id?: ValueTypes["uuid"]
	};
	/** aggregate max on columns */
	["follows_max_fields"]: AliasType<{
		created_at?: true,
		follower_id?: true,
		updated_at?: true,
		user_id?: true,
		__typename?: true
	}>;
	/** order by max() on columns of table "follows" */
	["follows_max_order_by"]: {
		created_at?: ValueTypes["order_by"],
		follower_id?: ValueTypes["order_by"],
		updated_at?: ValueTypes["order_by"],
		user_id?: ValueTypes["order_by"]
	};
	/** aggregate min on columns */
	["follows_min_fields"]: AliasType<{
		created_at?: true,
		follower_id?: true,
		updated_at?: true,
		user_id?: true,
		__typename?: true
	}>;
	/** order by min() on columns of table "follows" */
	["follows_min_order_by"]: {
		created_at?: ValueTypes["order_by"],
		follower_id?: ValueTypes["order_by"],
		updated_at?: ValueTypes["order_by"],
		user_id?: ValueTypes["order_by"]
	};
	/** response of any mutation on the table "follows" */
	["follows_mutation_response"]: AliasType<{
		/** number of rows affected by the mutation */
		affected_rows?: true,
		/** data from the rows affected by the mutation */
		returning?: ValueTypes["follows"],
		__typename?: true
	}>;
	/** Ordering options when selecting data from "follows". */
	["follows_order_by"]: {
		created_at?: ValueTypes["order_by"],
		follower_id?: ValueTypes["order_by"],
		updated_at?: ValueTypes["order_by"],
		user?: ValueTypes["users_order_by"],
		userByUserId?: ValueTypes["users_order_by"],
		user_id?: ValueTypes["order_by"]
	};
	/** select columns of table "follows" */
	["follows_select_column"]: follows_select_column;
	/** input type for updating data in table "follows" */
	["follows_set_input"]: {
		created_at?: ValueTypes["timestamptz"],
		follower_id?: ValueTypes["uuid"],
		updated_at?: ValueTypes["timestamptz"],
		user_id?: ValueTypes["uuid"]
	};
	/** mutation root */
	["mutation_root"]: AliasType<{
		delete_follows?: [{	/** filter the rows which have to be deleted */
			where: ValueTypes["follows_bool_exp"]
		}, ValueTypes["follows_mutation_response"]],
		delete_posts?: [{	/** filter the rows which have to be deleted */
			where: ValueTypes["posts_bool_exp"]
		}, ValueTypes["posts_mutation_response"]],
		delete_users?: [{	/** filter the rows which have to be deleted */
			where: ValueTypes["users_bool_exp"]
		}, ValueTypes["users_mutation_response"]],
		delete_users_by_pk?: [{ id: ValueTypes["uuid"] }, ValueTypes["users"]],
		insert_follows?: [{	/** the rows to be inserted */
			objects: ValueTypes["follows_insert_input"][]
		}, ValueTypes["follows_mutation_response"]],
		insert_follows_one?: [{	/** the row to be inserted */
			object: ValueTypes["follows_insert_input"]
		}, ValueTypes["follows"]],
		insert_posts?: [{	/** the rows to be inserted */
			objects: ValueTypes["posts_insert_input"][]
		}, ValueTypes["posts_mutation_response"]],
		insert_posts_one?: [{	/** the row to be inserted */
			object: ValueTypes["posts_insert_input"]
		}, ValueTypes["posts"]],
		insert_users?: [{	/** the rows to be inserted */
			objects: ValueTypes["users_insert_input"][],	/** on conflict condition */
			on_conflict?: ValueTypes["users_on_conflict"]
		}, ValueTypes["users_mutation_response"]],
		insert_users_one?: [{	/** the row to be inserted */
			object: ValueTypes["users_insert_input"],	/** on conflict condition */
			on_conflict?: ValueTypes["users_on_conflict"]
		}, ValueTypes["users"]],
		update_follows?: [{	/** sets the columns of the filtered rows to the given values */
			_set?: ValueTypes["follows_set_input"],	/** filter the rows which have to be updated */
			where: ValueTypes["follows_bool_exp"]
		}, ValueTypes["follows_mutation_response"]],
		update_posts?: [{	/** sets the columns of the filtered rows to the given values */
			_set?: ValueTypes["posts_set_input"],	/** filter the rows which have to be updated */
			where: ValueTypes["posts_bool_exp"]
		}, ValueTypes["posts_mutation_response"]],
		update_users?: [{	/** sets the columns of the filtered rows to the given values */
			_set?: ValueTypes["users_set_input"],	/** filter the rows which have to be updated */
			where: ValueTypes["users_bool_exp"]
		}, ValueTypes["users_mutation_response"]],
		update_users_by_pk?: [{	/** sets the columns of the filtered rows to the given values */
			_set?: ValueTypes["users_set_input"], pk_columns: ValueTypes["users_pk_columns_input"]
		}, ValueTypes["users"]],
		__typename?: true
	}>;
	/** column ordering options */
	["order_by"]: order_by;
	/** columns and relationships of "posts" */
	["posts"]: AliasType<{
		content?: true,
		created_at?: true,
		id?: true,
		updated_at?: true,
		/** An object relationship */
		user?: ValueTypes["users"],
		user_id?: true,
		__typename?: true
	}>;
	/** aggregated selection of "posts" */
	["posts_aggregate"]: AliasType<{
		aggregate?: ValueTypes["posts_aggregate_fields"],
		nodes?: ValueTypes["posts"],
		__typename?: true
	}>;
	/** aggregate fields of "posts" */
	["posts_aggregate_fields"]: AliasType<{
		count?: [{ columns?: ValueTypes["posts_select_column"][], distinct?: boolean }, true],
		max?: ValueTypes["posts_max_fields"],
		min?: ValueTypes["posts_min_fields"],
		__typename?: true
	}>;
	/** order by aggregate values of table "posts" */
	["posts_aggregate_order_by"]: {
		count?: ValueTypes["order_by"],
		max?: ValueTypes["posts_max_order_by"],
		min?: ValueTypes["posts_min_order_by"]
	};
	/** input type for inserting array relation for remote table "posts" */
	["posts_arr_rel_insert_input"]: {
		data: ValueTypes["posts_insert_input"][]
	};
	/** Boolean expression to filter rows from the table "posts". All fields are combined with a logical 'AND'. */
	["posts_bool_exp"]: {
		_and?: ValueTypes["posts_bool_exp"][],
		_not?: ValueTypes["posts_bool_exp"],
		_or?: ValueTypes["posts_bool_exp"][],
		content?: ValueTypes["String_comparison_exp"],
		created_at?: ValueTypes["timestamptz_comparison_exp"],
		id?: ValueTypes["uuid_comparison_exp"],
		updated_at?: ValueTypes["timestamptz_comparison_exp"],
		user?: ValueTypes["users_bool_exp"],
		user_id?: ValueTypes["uuid_comparison_exp"]
	};
	/** input type for inserting data into table "posts" */
	["posts_insert_input"]: {
		content?: string,
		created_at?: ValueTypes["timestamptz"],
		id?: ValueTypes["uuid"],
		updated_at?: ValueTypes["timestamptz"],
		user?: ValueTypes["users_obj_rel_insert_input"],
		user_id?: ValueTypes["uuid"]
	};
	/** aggregate max on columns */
	["posts_max_fields"]: AliasType<{
		content?: true,
		created_at?: true,
		id?: true,
		updated_at?: true,
		user_id?: true,
		__typename?: true
	}>;
	/** order by max() on columns of table "posts" */
	["posts_max_order_by"]: {
		content?: ValueTypes["order_by"],
		created_at?: ValueTypes["order_by"],
		id?: ValueTypes["order_by"],
		updated_at?: ValueTypes["order_by"],
		user_id?: ValueTypes["order_by"]
	};
	/** aggregate min on columns */
	["posts_min_fields"]: AliasType<{
		content?: true,
		created_at?: true,
		id?: true,
		updated_at?: true,
		user_id?: true,
		__typename?: true
	}>;
	/** order by min() on columns of table "posts" */
	["posts_min_order_by"]: {
		content?: ValueTypes["order_by"],
		created_at?: ValueTypes["order_by"],
		id?: ValueTypes["order_by"],
		updated_at?: ValueTypes["order_by"],
		user_id?: ValueTypes["order_by"]
	};
	/** response of any mutation on the table "posts" */
	["posts_mutation_response"]: AliasType<{
		/** number of rows affected by the mutation */
		affected_rows?: true,
		/** data from the rows affected by the mutation */
		returning?: ValueTypes["posts"],
		__typename?: true
	}>;
	/** Ordering options when selecting data from "posts". */
	["posts_order_by"]: {
		content?: ValueTypes["order_by"],
		created_at?: ValueTypes["order_by"],
		id?: ValueTypes["order_by"],
		updated_at?: ValueTypes["order_by"],
		user?: ValueTypes["users_order_by"],
		user_id?: ValueTypes["order_by"]
	};
	/** select columns of table "posts" */
	["posts_select_column"]: posts_select_column;
	/** input type for updating data in table "posts" */
	["posts_set_input"]: {
		content?: string,
		created_at?: ValueTypes["timestamptz"],
		id?: ValueTypes["uuid"],
		updated_at?: ValueTypes["timestamptz"],
		user_id?: ValueTypes["uuid"]
	};
	["query_root"]: AliasType<{
		follows?: [{	/** distinct select on columns */
			distinct_on?: ValueTypes["follows_select_column"][],	/** limit the number of rows returned */
			limit?: number,	/** skip the first n rows. Use only with order_by */
			offset?: number,	/** sort the rows by one or more columns */
			order_by?: ValueTypes["follows_order_by"][],	/** filter the rows returned */
			where?: ValueTypes["follows_bool_exp"]
		}, ValueTypes["follows"]],
		follows_aggregate?: [{	/** distinct select on columns */
			distinct_on?: ValueTypes["follows_select_column"][],	/** limit the number of rows returned */
			limit?: number,	/** skip the first n rows. Use only with order_by */
			offset?: number,	/** sort the rows by one or more columns */
			order_by?: ValueTypes["follows_order_by"][],	/** filter the rows returned */
			where?: ValueTypes["follows_bool_exp"]
		}, ValueTypes["follows_aggregate"]],
		posts?: [{	/** distinct select on columns */
			distinct_on?: ValueTypes["posts_select_column"][],	/** limit the number of rows returned */
			limit?: number,	/** skip the first n rows. Use only with order_by */
			offset?: number,	/** sort the rows by one or more columns */
			order_by?: ValueTypes["posts_order_by"][],	/** filter the rows returned */
			where?: ValueTypes["posts_bool_exp"]
		}, ValueTypes["posts"]],
		posts_aggregate?: [{	/** distinct select on columns */
			distinct_on?: ValueTypes["posts_select_column"][],	/** limit the number of rows returned */
			limit?: number,	/** skip the first n rows. Use only with order_by */
			offset?: number,	/** sort the rows by one or more columns */
			order_by?: ValueTypes["posts_order_by"][],	/** filter the rows returned */
			where?: ValueTypes["posts_bool_exp"]
		}, ValueTypes["posts_aggregate"]],
		users?: [{	/** distinct select on columns */
			distinct_on?: ValueTypes["users_select_column"][],	/** limit the number of rows returned */
			limit?: number,	/** skip the first n rows. Use only with order_by */
			offset?: number,	/** sort the rows by one or more columns */
			order_by?: ValueTypes["users_order_by"][],	/** filter the rows returned */
			where?: ValueTypes["users_bool_exp"]
		}, ValueTypes["users"]],
		users_aggregate?: [{	/** distinct select on columns */
			distinct_on?: ValueTypes["users_select_column"][],	/** limit the number of rows returned */
			limit?: number,	/** skip the first n rows. Use only with order_by */
			offset?: number,	/** sort the rows by one or more columns */
			order_by?: ValueTypes["users_order_by"][],	/** filter the rows returned */
			where?: ValueTypes["users_bool_exp"]
		}, ValueTypes["users_aggregate"]],
		users_by_pk?: [{ id: ValueTypes["uuid"] }, ValueTypes["users"]],
		__typename?: true
	}>;
	["subscription_root"]: AliasType<{
		follows?: [{	/** distinct select on columns */
			distinct_on?: ValueTypes["follows_select_column"][],	/** limit the number of rows returned */
			limit?: number,	/** skip the first n rows. Use only with order_by */
			offset?: number,	/** sort the rows by one or more columns */
			order_by?: ValueTypes["follows_order_by"][],	/** filter the rows returned */
			where?: ValueTypes["follows_bool_exp"]
		}, ValueTypes["follows"]],
		follows_aggregate?: [{	/** distinct select on columns */
			distinct_on?: ValueTypes["follows_select_column"][],	/** limit the number of rows returned */
			limit?: number,	/** skip the first n rows. Use only with order_by */
			offset?: number,	/** sort the rows by one or more columns */
			order_by?: ValueTypes["follows_order_by"][],	/** filter the rows returned */
			where?: ValueTypes["follows_bool_exp"]
		}, ValueTypes["follows_aggregate"]],
		posts?: [{	/** distinct select on columns */
			distinct_on?: ValueTypes["posts_select_column"][],	/** limit the number of rows returned */
			limit?: number,	/** skip the first n rows. Use only with order_by */
			offset?: number,	/** sort the rows by one or more columns */
			order_by?: ValueTypes["posts_order_by"][],	/** filter the rows returned */
			where?: ValueTypes["posts_bool_exp"]
		}, ValueTypes["posts"]],
		posts_aggregate?: [{	/** distinct select on columns */
			distinct_on?: ValueTypes["posts_select_column"][],	/** limit the number of rows returned */
			limit?: number,	/** skip the first n rows. Use only with order_by */
			offset?: number,	/** sort the rows by one or more columns */
			order_by?: ValueTypes["posts_order_by"][],	/** filter the rows returned */
			where?: ValueTypes["posts_bool_exp"]
		}, ValueTypes["posts_aggregate"]],
		users?: [{	/** distinct select on columns */
			distinct_on?: ValueTypes["users_select_column"][],	/** limit the number of rows returned */
			limit?: number,	/** skip the first n rows. Use only with order_by */
			offset?: number,	/** sort the rows by one or more columns */
			order_by?: ValueTypes["users_order_by"][],	/** filter the rows returned */
			where?: ValueTypes["users_bool_exp"]
		}, ValueTypes["users"]],
		users_aggregate?: [{	/** distinct select on columns */
			distinct_on?: ValueTypes["users_select_column"][],	/** limit the number of rows returned */
			limit?: number,	/** skip the first n rows. Use only with order_by */
			offset?: number,	/** sort the rows by one or more columns */
			order_by?: ValueTypes["users_order_by"][],	/** filter the rows returned */
			where?: ValueTypes["users_bool_exp"]
		}, ValueTypes["users_aggregate"]],
		users_by_pk?: [{ id: ValueTypes["uuid"] }, ValueTypes["users"]],
		__typename?: true
	}>;
	["timestamptz"]: unknown;
	/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
	["timestamptz_comparison_exp"]: {
		_eq?: ValueTypes["timestamptz"],
		_gt?: ValueTypes["timestamptz"],
		_gte?: ValueTypes["timestamptz"],
		_in?: ValueTypes["timestamptz"][],
		_is_null?: boolean,
		_lt?: ValueTypes["timestamptz"],
		_lte?: ValueTypes["timestamptz"],
		_neq?: ValueTypes["timestamptz"],
		_nin?: ValueTypes["timestamptz"][]
	};
	/** columns and relationships of "users" */
	["users"]: AliasType<{
		avatar_url?: true,
		created_at?: true,
		email?: true,
		first_name?: true,
		follows?: [{	/** distinct select on columns */
			distinct_on?: ValueTypes["follows_select_column"][],	/** limit the number of rows returned */
			limit?: number,	/** skip the first n rows. Use only with order_by */
			offset?: number,	/** sort the rows by one or more columns */
			order_by?: ValueTypes["follows_order_by"][],	/** filter the rows returned */
			where?: ValueTypes["follows_bool_exp"]
		}, ValueTypes["follows"]],
		follows_aggregate?: [{	/** distinct select on columns */
			distinct_on?: ValueTypes["follows_select_column"][],	/** limit the number of rows returned */
			limit?: number,	/** skip the first n rows. Use only with order_by */
			offset?: number,	/** sort the rows by one or more columns */
			order_by?: ValueTypes["follows_order_by"][],	/** filter the rows returned */
			where?: ValueTypes["follows_bool_exp"]
		}, ValueTypes["follows_aggregate"]],
		id?: true,
		last_name?: true,
		password?: true,
		posts?: [{	/** distinct select on columns */
			distinct_on?: ValueTypes["posts_select_column"][],	/** limit the number of rows returned */
			limit?: number,	/** skip the first n rows. Use only with order_by */
			offset?: number,	/** sort the rows by one or more columns */
			order_by?: ValueTypes["posts_order_by"][],	/** filter the rows returned */
			where?: ValueTypes["posts_bool_exp"]
		}, ValueTypes["posts"]],
		posts_aggregate?: [{	/** distinct select on columns */
			distinct_on?: ValueTypes["posts_select_column"][],	/** limit the number of rows returned */
			limit?: number,	/** skip the first n rows. Use only with order_by */
			offset?: number,	/** sort the rows by one or more columns */
			order_by?: ValueTypes["posts_order_by"][],	/** filter the rows returned */
			where?: ValueTypes["posts_bool_exp"]
		}, ValueTypes["posts_aggregate"]],
		updated_at?: true,
		__typename?: true
	}>;
	/** aggregated selection of "users" */
	["users_aggregate"]: AliasType<{
		aggregate?: ValueTypes["users_aggregate_fields"],
		nodes?: ValueTypes["users"],
		__typename?: true
	}>;
	/** aggregate fields of "users" */
	["users_aggregate_fields"]: AliasType<{
		count?: [{ columns?: ValueTypes["users_select_column"][], distinct?: boolean }, true],
		max?: ValueTypes["users_max_fields"],
		min?: ValueTypes["users_min_fields"],
		__typename?: true
	}>;
	/** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
	["users_bool_exp"]: {
		_and?: ValueTypes["users_bool_exp"][],
		_not?: ValueTypes["users_bool_exp"],
		_or?: ValueTypes["users_bool_exp"][],
		avatar_url?: ValueTypes["String_comparison_exp"],
		created_at?: ValueTypes["timestamptz_comparison_exp"],
		email?: ValueTypes["String_comparison_exp"],
		first_name?: ValueTypes["String_comparison_exp"],
		follows?: ValueTypes["follows_bool_exp"],
		id?: ValueTypes["uuid_comparison_exp"],
		last_name?: ValueTypes["String_comparison_exp"],
		password?: ValueTypes["String_comparison_exp"],
		posts?: ValueTypes["posts_bool_exp"],
		updated_at?: ValueTypes["timestamptz_comparison_exp"]
	};
	/** unique or primary key constraints on table "users" */
	["users_constraint"]: users_constraint;
	/** input type for inserting data into table "users" */
	["users_insert_input"]: {
		avatar_url?: string,
		created_at?: ValueTypes["timestamptz"],
		email?: string,
		first_name?: string,
		follows?: ValueTypes["follows_arr_rel_insert_input"],
		id?: ValueTypes["uuid"],
		last_name?: string,
		password?: string,
		posts?: ValueTypes["posts_arr_rel_insert_input"],
		updated_at?: ValueTypes["timestamptz"]
	};
	/** aggregate max on columns */
	["users_max_fields"]: AliasType<{
		avatar_url?: true,
		created_at?: true,
		email?: true,
		first_name?: true,
		id?: true,
		last_name?: true,
		password?: true,
		updated_at?: true,
		__typename?: true
	}>;
	/** aggregate min on columns */
	["users_min_fields"]: AliasType<{
		avatar_url?: true,
		created_at?: true,
		email?: true,
		first_name?: true,
		id?: true,
		last_name?: true,
		password?: true,
		updated_at?: true,
		__typename?: true
	}>;
	/** response of any mutation on the table "users" */
	["users_mutation_response"]: AliasType<{
		/** number of rows affected by the mutation */
		affected_rows?: true,
		/** data from the rows affected by the mutation */
		returning?: ValueTypes["users"],
		__typename?: true
	}>;
	/** input type for inserting object relation for remote table "users" */
	["users_obj_rel_insert_input"]: {
		data: ValueTypes["users_insert_input"],
		/** on conflict condition */
		on_conflict?: ValueTypes["users_on_conflict"]
	};
	/** on conflict condition type for table "users" */
	["users_on_conflict"]: {
		constraint: ValueTypes["users_constraint"],
		update_columns: ValueTypes["users_update_column"][],
		where?: ValueTypes["users_bool_exp"]
	};
	/** Ordering options when selecting data from "users". */
	["users_order_by"]: {
		avatar_url?: ValueTypes["order_by"],
		created_at?: ValueTypes["order_by"],
		email?: ValueTypes["order_by"],
		first_name?: ValueTypes["order_by"],
		follows_aggregate?: ValueTypes["follows_aggregate_order_by"],
		id?: ValueTypes["order_by"],
		last_name?: ValueTypes["order_by"],
		password?: ValueTypes["order_by"],
		posts_aggregate?: ValueTypes["posts_aggregate_order_by"],
		updated_at?: ValueTypes["order_by"]
	};
	/** primary key columns input for table: users */
	["users_pk_columns_input"]: {
		id: ValueTypes["uuid"]
	};
	/** select columns of table "users" */
	["users_select_column"]: users_select_column;
	/** input type for updating data in table "users" */
	["users_set_input"]: {
		avatar_url?: string,
		created_at?: ValueTypes["timestamptz"],
		email?: string,
		first_name?: string,
		id?: ValueTypes["uuid"],
		last_name?: string,
		password?: string,
		updated_at?: ValueTypes["timestamptz"]
	};
	/** update columns of table "users" */
	["users_update_column"]: users_update_column;
	["uuid"]: unknown;
	/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
	["uuid_comparison_exp"]: {
		_eq?: ValueTypes["uuid"],
		_gt?: ValueTypes["uuid"],
		_gte?: ValueTypes["uuid"],
		_in?: ValueTypes["uuid"][],
		_is_null?: boolean,
		_lt?: ValueTypes["uuid"],
		_lte?: ValueTypes["uuid"],
		_neq?: ValueTypes["uuid"],
		_nin?: ValueTypes["uuid"][]
	}
}

export type ModelTypes = {
	/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
	["String_comparison_exp"]: GraphQLTypes["String_comparison_exp"];
	/** columns and relationships of "follows" */
	["follows"]: {
		created_at: ModelTypes["timestamptz"],
		follower_id?: ModelTypes["uuid"],
		updated_at: ModelTypes["timestamptz"],
		/** An object relationship */
		user?: ModelTypes["users"],
		/** An object relationship */
		userByUserId?: ModelTypes["users"],
		user_id?: ModelTypes["uuid"]
	};
	/** aggregated selection of "follows" */
	["follows_aggregate"]: {
		aggregate?: ModelTypes["follows_aggregate_fields"],
		nodes: ModelTypes["follows"][]
	};
	/** aggregate fields of "follows" */
	["follows_aggregate_fields"]: {
		count: number,
		max?: ModelTypes["follows_max_fields"],
		min?: ModelTypes["follows_min_fields"]
	};
	/** order by aggregate values of table "follows" */
	["follows_aggregate_order_by"]: GraphQLTypes["follows_aggregate_order_by"];
	/** input type for inserting array relation for remote table "follows" */
	["follows_arr_rel_insert_input"]: GraphQLTypes["follows_arr_rel_insert_input"];
	/** Boolean expression to filter rows from the table "follows". All fields are combined with a logical 'AND'. */
	["follows_bool_exp"]: GraphQLTypes["follows_bool_exp"];
	/** input type for inserting data into table "follows" */
	["follows_insert_input"]: GraphQLTypes["follows_insert_input"];
	/** aggregate max on columns */
	["follows_max_fields"]: {
		created_at?: ModelTypes["timestamptz"],
		follower_id?: ModelTypes["uuid"],
		updated_at?: ModelTypes["timestamptz"],
		user_id?: ModelTypes["uuid"]
	};
	/** order by max() on columns of table "follows" */
	["follows_max_order_by"]: GraphQLTypes["follows_max_order_by"];
	/** aggregate min on columns */
	["follows_min_fields"]: {
		created_at?: ModelTypes["timestamptz"],
		follower_id?: ModelTypes["uuid"],
		updated_at?: ModelTypes["timestamptz"],
		user_id?: ModelTypes["uuid"]
	};
	/** order by min() on columns of table "follows" */
	["follows_min_order_by"]: GraphQLTypes["follows_min_order_by"];
	/** response of any mutation on the table "follows" */
	["follows_mutation_response"]: {
		/** number of rows affected by the mutation */
		affected_rows: number,
		/** data from the rows affected by the mutation */
		returning: ModelTypes["follows"][]
	};
	/** Ordering options when selecting data from "follows". */
	["follows_order_by"]: GraphQLTypes["follows_order_by"];
	/** select columns of table "follows" */
	["follows_select_column"]: GraphQLTypes["follows_select_column"];
	/** input type for updating data in table "follows" */
	["follows_set_input"]: GraphQLTypes["follows_set_input"];
	/** mutation root */
	["mutation_root"]: {
		/** delete data from the table: "follows" */
		delete_follows?: ModelTypes["follows_mutation_response"],
		/** delete data from the table: "posts" */
		delete_posts?: ModelTypes["posts_mutation_response"],
		/** delete data from the table: "users" */
		delete_users?: ModelTypes["users_mutation_response"],
		/** delete single row from the table: "users" */
		delete_users_by_pk?: ModelTypes["users"],
		/** insert data into the table: "follows" */
		insert_follows?: ModelTypes["follows_mutation_response"],
		/** insert a single row into the table: "follows" */
		insert_follows_one?: ModelTypes["follows"],
		/** insert data into the table: "posts" */
		insert_posts?: ModelTypes["posts_mutation_response"],
		/** insert a single row into the table: "posts" */
		insert_posts_one?: ModelTypes["posts"],
		/** insert data into the table: "users" */
		insert_users?: ModelTypes["users_mutation_response"],
		/** insert a single row into the table: "users" */
		insert_users_one?: ModelTypes["users"],
		/** update data of the table: "follows" */
		update_follows?: ModelTypes["follows_mutation_response"],
		/** update data of the table: "posts" */
		update_posts?: ModelTypes["posts_mutation_response"],
		/** update data of the table: "users" */
		update_users?: ModelTypes["users_mutation_response"],
		/** update single row of the table: "users" */
		update_users_by_pk?: ModelTypes["users"]
	};
	/** column ordering options */
	["order_by"]: GraphQLTypes["order_by"];
	/** columns and relationships of "posts" */
	["posts"]: {
		content?: string,
		created_at: ModelTypes["timestamptz"],
		id?: ModelTypes["uuid"],
		updated_at: ModelTypes["timestamptz"],
		/** An object relationship */
		user?: ModelTypes["users"],
		user_id?: ModelTypes["uuid"]
	};
	/** aggregated selection of "posts" */
	["posts_aggregate"]: {
		aggregate?: ModelTypes["posts_aggregate_fields"],
		nodes: ModelTypes["posts"][]
	};
	/** aggregate fields of "posts" */
	["posts_aggregate_fields"]: {
		count: number,
		max?: ModelTypes["posts_max_fields"],
		min?: ModelTypes["posts_min_fields"]
	};
	/** order by aggregate values of table "posts" */
	["posts_aggregate_order_by"]: GraphQLTypes["posts_aggregate_order_by"];
	/** input type for inserting array relation for remote table "posts" */
	["posts_arr_rel_insert_input"]: GraphQLTypes["posts_arr_rel_insert_input"];
	/** Boolean expression to filter rows from the table "posts". All fields are combined with a logical 'AND'. */
	["posts_bool_exp"]: GraphQLTypes["posts_bool_exp"];
	/** input type for inserting data into table "posts" */
	["posts_insert_input"]: GraphQLTypes["posts_insert_input"];
	/** aggregate max on columns */
	["posts_max_fields"]: {
		content?: string,
		created_at?: ModelTypes["timestamptz"],
		id?: ModelTypes["uuid"],
		updated_at?: ModelTypes["timestamptz"],
		user_id?: ModelTypes["uuid"]
	};
	/** order by max() on columns of table "posts" */
	["posts_max_order_by"]: GraphQLTypes["posts_max_order_by"];
	/** aggregate min on columns */
	["posts_min_fields"]: {
		content?: string,
		created_at?: ModelTypes["timestamptz"],
		id?: ModelTypes["uuid"],
		updated_at?: ModelTypes["timestamptz"],
		user_id?: ModelTypes["uuid"]
	};
	/** order by min() on columns of table "posts" */
	["posts_min_order_by"]: GraphQLTypes["posts_min_order_by"];
	/** response of any mutation on the table "posts" */
	["posts_mutation_response"]: {
		/** number of rows affected by the mutation */
		affected_rows: number,
		/** data from the rows affected by the mutation */
		returning: ModelTypes["posts"][]
	};
	/** Ordering options when selecting data from "posts". */
	["posts_order_by"]: GraphQLTypes["posts_order_by"];
	/** select columns of table "posts" */
	["posts_select_column"]: GraphQLTypes["posts_select_column"];
	/** input type for updating data in table "posts" */
	["posts_set_input"]: GraphQLTypes["posts_set_input"];
	["query_root"]: {
		/** An array relationship */
		follows: ModelTypes["follows"][],
		/** An aggregate relationship */
		follows_aggregate: ModelTypes["follows_aggregate"],
		/** An array relationship */
		posts: ModelTypes["posts"][],
		/** An aggregate relationship */
		posts_aggregate: ModelTypes["posts_aggregate"],
		/** fetch data from the table: "users" */
		users: ModelTypes["users"][],
		/** fetch aggregated fields from the table: "users" */
		users_aggregate: ModelTypes["users_aggregate"],
		/** fetch data from the table: "users" using primary key columns */
		users_by_pk?: ModelTypes["users"]
	};
	["subscription_root"]: {
		/** An array relationship */
		follows: ModelTypes["follows"][],
		/** An aggregate relationship */
		follows_aggregate: ModelTypes["follows_aggregate"],
		/** An array relationship */
		posts: ModelTypes["posts"][],
		/** An aggregate relationship */
		posts_aggregate: ModelTypes["posts_aggregate"],
		/** fetch data from the table: "users" */
		users: ModelTypes["users"][],
		/** fetch aggregated fields from the table: "users" */
		users_aggregate: ModelTypes["users_aggregate"],
		/** fetch data from the table: "users" using primary key columns */
		users_by_pk?: ModelTypes["users"]
	};
	["timestamptz"]: any;
	/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
	["timestamptz_comparison_exp"]: GraphQLTypes["timestamptz_comparison_exp"];
	/** columns and relationships of "users" */
	["users"]: {
		avatar_url?: string,
		created_at: ModelTypes["timestamptz"],
		email: string,
		first_name?: string,
		/** An array relationship */
		follows: ModelTypes["follows"][],
		/** An aggregate relationship */
		follows_aggregate: ModelTypes["follows_aggregate"],
		id: ModelTypes["uuid"],
		last_name?: string,
		password: string,
		/** An array relationship */
		posts: ModelTypes["posts"][],
		/** An aggregate relationship */
		posts_aggregate: ModelTypes["posts_aggregate"],
		updated_at: ModelTypes["timestamptz"]
	};
	/** aggregated selection of "users" */
	["users_aggregate"]: {
		aggregate?: ModelTypes["users_aggregate_fields"],
		nodes: ModelTypes["users"][]
	};
	/** aggregate fields of "users" */
	["users_aggregate_fields"]: {
		count: number,
		max?: ModelTypes["users_max_fields"],
		min?: ModelTypes["users_min_fields"]
	};
	/** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
	["users_bool_exp"]: GraphQLTypes["users_bool_exp"];
	/** unique or primary key constraints on table "users" */
	["users_constraint"]: GraphQLTypes["users_constraint"];
	/** input type for inserting data into table "users" */
	["users_insert_input"]: GraphQLTypes["users_insert_input"];
	/** aggregate max on columns */
	["users_max_fields"]: {
		avatar_url?: string,
		created_at?: ModelTypes["timestamptz"],
		email?: string,
		first_name?: string,
		id?: ModelTypes["uuid"],
		last_name?: string,
		password?: string,
		updated_at?: ModelTypes["timestamptz"]
	};
	/** aggregate min on columns */
	["users_min_fields"]: {
		avatar_url?: string,
		created_at?: ModelTypes["timestamptz"],
		email?: string,
		first_name?: string,
		id?: ModelTypes["uuid"],
		last_name?: string,
		password?: string,
		updated_at?: ModelTypes["timestamptz"]
	};
	/** response of any mutation on the table "users" */
	["users_mutation_response"]: {
		/** number of rows affected by the mutation */
		affected_rows: number,
		/** data from the rows affected by the mutation */
		returning: ModelTypes["users"][]
	};
	/** input type for inserting object relation for remote table "users" */
	["users_obj_rel_insert_input"]: GraphQLTypes["users_obj_rel_insert_input"];
	/** on conflict condition type for table "users" */
	["users_on_conflict"]: GraphQLTypes["users_on_conflict"];
	/** Ordering options when selecting data from "users". */
	["users_order_by"]: GraphQLTypes["users_order_by"];
	/** primary key columns input for table: users */
	["users_pk_columns_input"]: GraphQLTypes["users_pk_columns_input"];
	/** select columns of table "users" */
	["users_select_column"]: GraphQLTypes["users_select_column"];
	/** input type for updating data in table "users" */
	["users_set_input"]: GraphQLTypes["users_set_input"];
	/** update columns of table "users" */
	["users_update_column"]: GraphQLTypes["users_update_column"];
	["uuid"]: any;
	/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
	["uuid_comparison_exp"]: GraphQLTypes["uuid_comparison_exp"]
}

export type GraphQLTypes = {
	/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
	["String_comparison_exp"]: {
		_eq?: string,
		_gt?: string,
		_gte?: string,
		/** does the column match the given case-insensitive pattern */
		_ilike?: string,
		_in?: Array<string>,
		/** does the column match the given POSIX regular expression, case insensitive */
		_iregex?: string,
		_is_null?: boolean,
		/** does the column match the given pattern */
		_like?: string,
		_lt?: string,
		_lte?: string,
		_neq?: string,
		/** does the column NOT match the given case-insensitive pattern */
		_nilike?: string,
		_nin?: Array<string>,
		/** does the column NOT match the given POSIX regular expression, case insensitive */
		_niregex?: string,
		/** does the column NOT match the given pattern */
		_nlike?: string,
		/** does the column NOT match the given POSIX regular expression, case sensitive */
		_nregex?: string,
		/** does the column NOT match the given SQL regular expression */
		_nsimilar?: string,
		/** does the column match the given POSIX regular expression, case sensitive */
		_regex?: string,
		/** does the column match the given SQL regular expression */
		_similar?: string
	};
	/** columns and relationships of "follows" */
	["follows"]: {
		__typename: "follows",
		created_at: GraphQLTypes["timestamptz"],
		follower_id?: GraphQLTypes["uuid"],
		updated_at: GraphQLTypes["timestamptz"],
		/** An object relationship */
		user?: GraphQLTypes["users"],
		/** An object relationship */
		userByUserId?: GraphQLTypes["users"],
		user_id?: GraphQLTypes["uuid"]
	};
	/** aggregated selection of "follows" */
	["follows_aggregate"]: {
		__typename: "follows_aggregate",
		aggregate?: GraphQLTypes["follows_aggregate_fields"],
		nodes: Array<GraphQLTypes["follows"]>
	};
	/** aggregate fields of "follows" */
	["follows_aggregate_fields"]: {
		__typename: "follows_aggregate_fields",
		count: number,
		max?: GraphQLTypes["follows_max_fields"],
		min?: GraphQLTypes["follows_min_fields"]
	};
	/** order by aggregate values of table "follows" */
	["follows_aggregate_order_by"]: {
		count?: GraphQLTypes["order_by"],
		max?: GraphQLTypes["follows_max_order_by"],
		min?: GraphQLTypes["follows_min_order_by"]
	};
	/** input type for inserting array relation for remote table "follows" */
	["follows_arr_rel_insert_input"]: {
		data: Array<GraphQLTypes["follows_insert_input"]>
	};
	/** Boolean expression to filter rows from the table "follows". All fields are combined with a logical 'AND'. */
	["follows_bool_exp"]: {
		_and?: Array<GraphQLTypes["follows_bool_exp"]>,
		_not?: GraphQLTypes["follows_bool_exp"],
		_or?: Array<GraphQLTypes["follows_bool_exp"]>,
		created_at?: GraphQLTypes["timestamptz_comparison_exp"],
		follower_id?: GraphQLTypes["uuid_comparison_exp"],
		updated_at?: GraphQLTypes["timestamptz_comparison_exp"],
		user?: GraphQLTypes["users_bool_exp"],
		userByUserId?: GraphQLTypes["users_bool_exp"],
		user_id?: GraphQLTypes["uuid_comparison_exp"]
	};
	/** input type for inserting data into table "follows" */
	["follows_insert_input"]: {
		created_at?: GraphQLTypes["timestamptz"],
		follower_id?: GraphQLTypes["uuid"],
		updated_at?: GraphQLTypes["timestamptz"],
		user?: GraphQLTypes["users_obj_rel_insert_input"],
		userByUserId?: GraphQLTypes["users_obj_rel_insert_input"],
		user_id?: GraphQLTypes["uuid"]
	};
	/** aggregate max on columns */
	["follows_max_fields"]: {
		__typename: "follows_max_fields",
		created_at?: GraphQLTypes["timestamptz"],
		follower_id?: GraphQLTypes["uuid"],
		updated_at?: GraphQLTypes["timestamptz"],
		user_id?: GraphQLTypes["uuid"]
	};
	/** order by max() on columns of table "follows" */
	["follows_max_order_by"]: {
		created_at?: GraphQLTypes["order_by"],
		follower_id?: GraphQLTypes["order_by"],
		updated_at?: GraphQLTypes["order_by"],
		user_id?: GraphQLTypes["order_by"]
	};
	/** aggregate min on columns */
	["follows_min_fields"]: {
		__typename: "follows_min_fields",
		created_at?: GraphQLTypes["timestamptz"],
		follower_id?: GraphQLTypes["uuid"],
		updated_at?: GraphQLTypes["timestamptz"],
		user_id?: GraphQLTypes["uuid"]
	};
	/** order by min() on columns of table "follows" */
	["follows_min_order_by"]: {
		created_at?: GraphQLTypes["order_by"],
		follower_id?: GraphQLTypes["order_by"],
		updated_at?: GraphQLTypes["order_by"],
		user_id?: GraphQLTypes["order_by"]
	};
	/** response of any mutation on the table "follows" */
	["follows_mutation_response"]: {
		__typename: "follows_mutation_response",
		/** number of rows affected by the mutation */
		affected_rows: number,
		/** data from the rows affected by the mutation */
		returning: Array<GraphQLTypes["follows"]>
	};
	/** Ordering options when selecting data from "follows". */
	["follows_order_by"]: {
		created_at?: GraphQLTypes["order_by"],
		follower_id?: GraphQLTypes["order_by"],
		updated_at?: GraphQLTypes["order_by"],
		user?: GraphQLTypes["users_order_by"],
		userByUserId?: GraphQLTypes["users_order_by"],
		user_id?: GraphQLTypes["order_by"]
	};
	/** select columns of table "follows" */
	["follows_select_column"]: follows_select_column;
	/** input type for updating data in table "follows" */
	["follows_set_input"]: {
		created_at?: GraphQLTypes["timestamptz"],
		follower_id?: GraphQLTypes["uuid"],
		updated_at?: GraphQLTypes["timestamptz"],
		user_id?: GraphQLTypes["uuid"]
	};
	/** mutation root */
	["mutation_root"]: {
		__typename: "mutation_root",
		/** delete data from the table: "follows" */
		delete_follows?: GraphQLTypes["follows_mutation_response"],
		/** delete data from the table: "posts" */
		delete_posts?: GraphQLTypes["posts_mutation_response"],
		/** delete data from the table: "users" */
		delete_users?: GraphQLTypes["users_mutation_response"],
		/** delete single row from the table: "users" */
		delete_users_by_pk?: GraphQLTypes["users"],
		/** insert data into the table: "follows" */
		insert_follows?: GraphQLTypes["follows_mutation_response"],
		/** insert a single row into the table: "follows" */
		insert_follows_one?: GraphQLTypes["follows"],
		/** insert data into the table: "posts" */
		insert_posts?: GraphQLTypes["posts_mutation_response"],
		/** insert a single row into the table: "posts" */
		insert_posts_one?: GraphQLTypes["posts"],
		/** insert data into the table: "users" */
		insert_users?: GraphQLTypes["users_mutation_response"],
		/** insert a single row into the table: "users" */
		insert_users_one?: GraphQLTypes["users"],
		/** update data of the table: "follows" */
		update_follows?: GraphQLTypes["follows_mutation_response"],
		/** update data of the table: "posts" */
		update_posts?: GraphQLTypes["posts_mutation_response"],
		/** update data of the table: "users" */
		update_users?: GraphQLTypes["users_mutation_response"],
		/** update single row of the table: "users" */
		update_users_by_pk?: GraphQLTypes["users"]
	};
	/** column ordering options */
	["order_by"]: order_by;
	/** columns and relationships of "posts" */
	["posts"]: {
		__typename: "posts",
		content?: string,
		created_at: GraphQLTypes["timestamptz"],
		id?: GraphQLTypes["uuid"],
		updated_at: GraphQLTypes["timestamptz"],
		/** An object relationship */
		user?: GraphQLTypes["users"],
		user_id?: GraphQLTypes["uuid"]
	};
	/** aggregated selection of "posts" */
	["posts_aggregate"]: {
		__typename: "posts_aggregate",
		aggregate?: GraphQLTypes["posts_aggregate_fields"],
		nodes: Array<GraphQLTypes["posts"]>
	};
	/** aggregate fields of "posts" */
	["posts_aggregate_fields"]: {
		__typename: "posts_aggregate_fields",
		count: number,
		max?: GraphQLTypes["posts_max_fields"],
		min?: GraphQLTypes["posts_min_fields"]
	};
	/** order by aggregate values of table "posts" */
	["posts_aggregate_order_by"]: {
		count?: GraphQLTypes["order_by"],
		max?: GraphQLTypes["posts_max_order_by"],
		min?: GraphQLTypes["posts_min_order_by"]
	};
	/** input type for inserting array relation for remote table "posts" */
	["posts_arr_rel_insert_input"]: {
		data: Array<GraphQLTypes["posts_insert_input"]>
	};
	/** Boolean expression to filter rows from the table "posts". All fields are combined with a logical 'AND'. */
	["posts_bool_exp"]: {
		_and?: Array<GraphQLTypes["posts_bool_exp"]>,
		_not?: GraphQLTypes["posts_bool_exp"],
		_or?: Array<GraphQLTypes["posts_bool_exp"]>,
		content?: GraphQLTypes["String_comparison_exp"],
		created_at?: GraphQLTypes["timestamptz_comparison_exp"],
		id?: GraphQLTypes["uuid_comparison_exp"],
		updated_at?: GraphQLTypes["timestamptz_comparison_exp"],
		user?: GraphQLTypes["users_bool_exp"],
		user_id?: GraphQLTypes["uuid_comparison_exp"]
	};
	/** input type for inserting data into table "posts" */
	["posts_insert_input"]: {
		content?: string,
		created_at?: GraphQLTypes["timestamptz"],
		id?: GraphQLTypes["uuid"],
		updated_at?: GraphQLTypes["timestamptz"],
		user?: GraphQLTypes["users_obj_rel_insert_input"],
		user_id?: GraphQLTypes["uuid"]
	};
	/** aggregate max on columns */
	["posts_max_fields"]: {
		__typename: "posts_max_fields",
		content?: string,
		created_at?: GraphQLTypes["timestamptz"],
		id?: GraphQLTypes["uuid"],
		updated_at?: GraphQLTypes["timestamptz"],
		user_id?: GraphQLTypes["uuid"]
	};
	/** order by max() on columns of table "posts" */
	["posts_max_order_by"]: {
		content?: GraphQLTypes["order_by"],
		created_at?: GraphQLTypes["order_by"],
		id?: GraphQLTypes["order_by"],
		updated_at?: GraphQLTypes["order_by"],
		user_id?: GraphQLTypes["order_by"]
	};
	/** aggregate min on columns */
	["posts_min_fields"]: {
		__typename: "posts_min_fields",
		content?: string,
		created_at?: GraphQLTypes["timestamptz"],
		id?: GraphQLTypes["uuid"],
		updated_at?: GraphQLTypes["timestamptz"],
		user_id?: GraphQLTypes["uuid"]
	};
	/** order by min() on columns of table "posts" */
	["posts_min_order_by"]: {
		content?: GraphQLTypes["order_by"],
		created_at?: GraphQLTypes["order_by"],
		id?: GraphQLTypes["order_by"],
		updated_at?: GraphQLTypes["order_by"],
		user_id?: GraphQLTypes["order_by"]
	};
	/** response of any mutation on the table "posts" */
	["posts_mutation_response"]: {
		__typename: "posts_mutation_response",
		/** number of rows affected by the mutation */
		affected_rows: number,
		/** data from the rows affected by the mutation */
		returning: Array<GraphQLTypes["posts"]>
	};
	/** Ordering options when selecting data from "posts". */
	["posts_order_by"]: {
		content?: GraphQLTypes["order_by"],
		created_at?: GraphQLTypes["order_by"],
		id?: GraphQLTypes["order_by"],
		updated_at?: GraphQLTypes["order_by"],
		user?: GraphQLTypes["users_order_by"],
		user_id?: GraphQLTypes["order_by"]
	};
	/** select columns of table "posts" */
	["posts_select_column"]: posts_select_column;
	/** input type for updating data in table "posts" */
	["posts_set_input"]: {
		content?: string,
		created_at?: GraphQLTypes["timestamptz"],
		id?: GraphQLTypes["uuid"],
		updated_at?: GraphQLTypes["timestamptz"],
		user_id?: GraphQLTypes["uuid"]
	};
	["query_root"]: {
		__typename: "query_root",
		/** An array relationship */
		follows: Array<GraphQLTypes["follows"]>,
		/** An aggregate relationship */
		follows_aggregate: GraphQLTypes["follows_aggregate"],
		/** An array relationship */
		posts: Array<GraphQLTypes["posts"]>,
		/** An aggregate relationship */
		posts_aggregate: GraphQLTypes["posts_aggregate"],
		/** fetch data from the table: "users" */
		users: Array<GraphQLTypes["users"]>,
		/** fetch aggregated fields from the table: "users" */
		users_aggregate: GraphQLTypes["users_aggregate"],
		/** fetch data from the table: "users" using primary key columns */
		users_by_pk?: GraphQLTypes["users"]
	};
	["subscription_root"]: {
		__typename: "subscription_root",
		/** An array relationship */
		follows: Array<GraphQLTypes["follows"]>,
		/** An aggregate relationship */
		follows_aggregate: GraphQLTypes["follows_aggregate"],
		/** An array relationship */
		posts: Array<GraphQLTypes["posts"]>,
		/** An aggregate relationship */
		posts_aggregate: GraphQLTypes["posts_aggregate"],
		/** fetch data from the table: "users" */
		users: Array<GraphQLTypes["users"]>,
		/** fetch aggregated fields from the table: "users" */
		users_aggregate: GraphQLTypes["users_aggregate"],
		/** fetch data from the table: "users" using primary key columns */
		users_by_pk?: GraphQLTypes["users"]
	};
	["timestamptz"]: any;
	/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
	["timestamptz_comparison_exp"]: {
		_eq?: GraphQLTypes["timestamptz"],
		_gt?: GraphQLTypes["timestamptz"],
		_gte?: GraphQLTypes["timestamptz"],
		_in?: Array<GraphQLTypes["timestamptz"]>,
		_is_null?: boolean,
		_lt?: GraphQLTypes["timestamptz"],
		_lte?: GraphQLTypes["timestamptz"],
		_neq?: GraphQLTypes["timestamptz"],
		_nin?: Array<GraphQLTypes["timestamptz"]>
	};
	/** columns and relationships of "users" */
	["users"]: {
		__typename: "users",
		avatar_url?: string,
		created_at: GraphQLTypes["timestamptz"],
		email: string,
		first_name?: string,
		/** An array relationship */
		follows: Array<GraphQLTypes["follows"]>,
		/** An aggregate relationship */
		follows_aggregate: GraphQLTypes["follows_aggregate"],
		id: GraphQLTypes["uuid"],
		last_name?: string,
		password: string,
		/** An array relationship */
		posts: Array<GraphQLTypes["posts"]>,
		/** An aggregate relationship */
		posts_aggregate: GraphQLTypes["posts_aggregate"],
		updated_at: GraphQLTypes["timestamptz"]
	};
	/** aggregated selection of "users" */
	["users_aggregate"]: {
		__typename: "users_aggregate",
		aggregate?: GraphQLTypes["users_aggregate_fields"],
		nodes: Array<GraphQLTypes["users"]>
	};
	/** aggregate fields of "users" */
	["users_aggregate_fields"]: {
		__typename: "users_aggregate_fields",
		count: number,
		max?: GraphQLTypes["users_max_fields"],
		min?: GraphQLTypes["users_min_fields"]
	};
	/** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
	["users_bool_exp"]: {
		_and?: Array<GraphQLTypes["users_bool_exp"]>,
		_not?: GraphQLTypes["users_bool_exp"],
		_or?: Array<GraphQLTypes["users_bool_exp"]>,
		avatar_url?: GraphQLTypes["String_comparison_exp"],
		created_at?: GraphQLTypes["timestamptz_comparison_exp"],
		email?: GraphQLTypes["String_comparison_exp"],
		first_name?: GraphQLTypes["String_comparison_exp"],
		follows?: GraphQLTypes["follows_bool_exp"],
		id?: GraphQLTypes["uuid_comparison_exp"],
		last_name?: GraphQLTypes["String_comparison_exp"],
		password?: GraphQLTypes["String_comparison_exp"],
		posts?: GraphQLTypes["posts_bool_exp"],
		updated_at?: GraphQLTypes["timestamptz_comparison_exp"]
	};
	/** unique or primary key constraints on table "users" */
	["users_constraint"]: users_constraint;
	/** input type for inserting data into table "users" */
	["users_insert_input"]: {
		avatar_url?: string,
		created_at?: GraphQLTypes["timestamptz"],
		email?: string,
		first_name?: string,
		follows?: GraphQLTypes["follows_arr_rel_insert_input"],
		id?: GraphQLTypes["uuid"],
		last_name?: string,
		password?: string,
		posts?: GraphQLTypes["posts_arr_rel_insert_input"],
		updated_at?: GraphQLTypes["timestamptz"]
	};
	/** aggregate max on columns */
	["users_max_fields"]: {
		__typename: "users_max_fields",
		avatar_url?: string,
		created_at?: GraphQLTypes["timestamptz"],
		email?: string,
		first_name?: string,
		id?: GraphQLTypes["uuid"],
		last_name?: string,
		password?: string,
		updated_at?: GraphQLTypes["timestamptz"]
	};
	/** aggregate min on columns */
	["users_min_fields"]: {
		__typename: "users_min_fields",
		avatar_url?: string,
		created_at?: GraphQLTypes["timestamptz"],
		email?: string,
		first_name?: string,
		id?: GraphQLTypes["uuid"],
		last_name?: string,
		password?: string,
		updated_at?: GraphQLTypes["timestamptz"]
	};
	/** response of any mutation on the table "users" */
	["users_mutation_response"]: {
		__typename: "users_mutation_response",
		/** number of rows affected by the mutation */
		affected_rows: number,
		/** data from the rows affected by the mutation */
		returning: Array<GraphQLTypes["users"]>
	};
	/** input type for inserting object relation for remote table "users" */
	["users_obj_rel_insert_input"]: {
		data: GraphQLTypes["users_insert_input"],
		/** on conflict condition */
		on_conflict?: GraphQLTypes["users_on_conflict"]
	};
	/** on conflict condition type for table "users" */
	["users_on_conflict"]: {
		constraint: GraphQLTypes["users_constraint"],
		update_columns: Array<GraphQLTypes["users_update_column"]>,
		where?: GraphQLTypes["users_bool_exp"]
	};
	/** Ordering options when selecting data from "users". */
	["users_order_by"]: {
		avatar_url?: GraphQLTypes["order_by"],
		created_at?: GraphQLTypes["order_by"],
		email?: GraphQLTypes["order_by"],
		first_name?: GraphQLTypes["order_by"],
		follows_aggregate?: GraphQLTypes["follows_aggregate_order_by"],
		id?: GraphQLTypes["order_by"],
		last_name?: GraphQLTypes["order_by"],
		password?: GraphQLTypes["order_by"],
		posts_aggregate?: GraphQLTypes["posts_aggregate_order_by"],
		updated_at?: GraphQLTypes["order_by"]
	};
	/** primary key columns input for table: users */
	["users_pk_columns_input"]: {
		id: GraphQLTypes["uuid"]
	};
	/** select columns of table "users" */
	["users_select_column"]: users_select_column;
	/** input type for updating data in table "users" */
	["users_set_input"]: {
		avatar_url?: string,
		created_at?: GraphQLTypes["timestamptz"],
		email?: string,
		first_name?: string,
		id?: GraphQLTypes["uuid"],
		last_name?: string,
		password?: string,
		updated_at?: GraphQLTypes["timestamptz"]
	};
	/** update columns of table "users" */
	["users_update_column"]: users_update_column;
	["uuid"]: any;
	/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
	["uuid_comparison_exp"]: {
		_eq?: GraphQLTypes["uuid"],
		_gt?: GraphQLTypes["uuid"],
		_gte?: GraphQLTypes["uuid"],
		_in?: Array<GraphQLTypes["uuid"]>,
		_is_null?: boolean,
		_lt?: GraphQLTypes["uuid"],
		_lte?: GraphQLTypes["uuid"],
		_neq?: GraphQLTypes["uuid"],
		_nin?: Array<GraphQLTypes["uuid"]>
	}
}
/** select columns of table "follows" */
export enum follows_select_column {
	created_at = "created_at",
	follower_id = "follower_id",
	updated_at = "updated_at",
	user_id = "user_id"
}
/** column ordering options */
export enum order_by {
	asc = "asc",
	asc_nulls_first = "asc_nulls_first",
	asc_nulls_last = "asc_nulls_last",
	desc = "desc",
	desc_nulls_first = "desc_nulls_first",
	desc_nulls_last = "desc_nulls_last"
}
/** select columns of table "posts" */
export enum posts_select_column {
	content = "content",
	created_at = "created_at",
	id = "id",
	updated_at = "updated_at",
	user_id = "user_id"
}
/** unique or primary key constraints on table "users" */
export enum users_constraint {
	users_pkey = "users_pkey"
}
/** select columns of table "users" */
export enum users_select_column {
	avatar_url = "avatar_url",
	created_at = "created_at",
	email = "email",
	first_name = "first_name",
	id = "id",
	last_name = "last_name",
	password = "password",
	updated_at = "updated_at"
}
/** update columns of table "users" */
export enum users_update_column {
	avatar_url = "avatar_url",
	created_at = "created_at",
	email = "email",
	first_name = "first_name",
	id = "id",
	last_name = "last_name",
	password = "password",
	updated_at = "updated_at"
}
export class GraphQLError extends Error {
	constructor(public response: GraphQLResponse) {
		super("");
		console.error(response);
	}
	toString() {
		return "GraphQL Response Error";
	}
}


export type UnwrapPromise<T> = T extends Promise<infer R> ? R : T;
export type ZeusState<T extends (...args: any[]) => Promise<any>> = NonNullable<
	UnwrapPromise<ReturnType<T>>
>;
export type ZeusHook<
	T extends (
		...args: any[]
	) => Record<string, (...args: any[]) => Promise<any>>,
	N extends keyof ReturnType<T>
	> = ZeusState<ReturnType<T>[N]>;

type WithTypeNameValue<T> = T & {
	__typename?: true;
};
type AliasType<T> = WithTypeNameValue<T> & {
	__alias?: Record<string, WithTypeNameValue<T>>;
};
export interface GraphQLResponse {
	data?: Record<string, any>;
	errors?: Array<{
		message: string;
	}>;
}
type DeepAnify<T> = {
	[P in keyof T]?: any;
};
type IsPayLoad<T> = T extends [any, infer PayLoad] ? PayLoad : T;
type IsArray<T, U> = T extends Array<infer R> ? InputType<R, U>[] : InputType<T, U>;
type FlattenArray<T> = T extends Array<infer R> ? R : T;

type NotUnionTypes<SRC extends DeepAnify<DST>, DST> = {
	[P in keyof DST]: SRC[P] extends '__union' & infer R ? never : P;
}[keyof DST];

type ExtractUnions<SRC extends DeepAnify<DST>, DST> = {
	[P in keyof SRC]: SRC[P] extends '__union' & infer R
	? P extends keyof DST
	? IsArray<R, DST[P] & { __typename: true }>
	: {}
	: never;
}[keyof SRC];

type IsInterfaced<SRC extends DeepAnify<DST>, DST> = FlattenArray<SRC> extends ZEUS_INTERFACES | ZEUS_UNIONS
	? ExtractUnions<SRC, DST> &
	{
		[P in keyof Omit<Pick<SRC, NotUnionTypes<SRC, DST>>, '__typename'>]: DST[P] extends true
		? SRC[P]
		: IsArray<SRC[P], DST[P]>;
	}
	: {
		[P in keyof Pick<SRC, keyof DST>]: DST[P] extends true ? SRC[P] : IsArray<SRC[P], DST[P]>;
	};



export type MapType<SRC, DST> = SRC extends DeepAnify<DST> ? IsInterfaced<SRC, DST> : never;
type InputType<SRC, DST> = IsPayLoad<DST> extends { __alias: infer R }
	? {
		[P in keyof R]: MapType<SRC, R[P]>;
	} &
	MapType<SRC, Omit<IsPayLoad<DST>, '__alias'>>
	: MapType<SRC, IsPayLoad<DST>>;
type Func<P extends any[], R> = (...args: P) => R;
type AnyFunc = Func<any, any>;
export type ArgsType<F extends AnyFunc> = F extends Func<infer P, any> ? P : never;
export type OperationToGraphQL<V, T> = <Z extends V>(o: Z | V, variables?: Record<string, any>) => Promise<InputType<T, Z>>;
export type SubscriptionToGraphQL<V, T> = <Z extends V>(
	o: Z | V,
	variables?: Record<string, any>,
) => {
	ws: WebSocket;
	on: (fn: (args: InputType<T, Z>) => void) => void;
	off: (e: { data?: InputType<T, Z>; code?: number; reason?: string; message?: string }) => void;
	error: (e: { data?: InputType<T, Z>; message?: string }) => void;
	open: () => void;
};
export type CastToGraphQL<V, T> = (resultOfYourQuery: any) => <Z extends V>(o: Z | V) => InputType<T, Z>;
export type SelectionFunction<V> = <T>(t: T | V) => T;
export type fetchOptions = ArgsType<typeof fetch>;
type websocketOptions = typeof WebSocket extends new (
	...args: infer R
) => WebSocket
	? R
	: never;
export type chainOptions =
	| [fetchOptions[0], fetchOptions[1] & { websocket?: websocketOptions }]
	| [fetchOptions[0]];
export type FetchFunction = (
	query: string,
	variables?: Record<string, any>,
) => Promise<any>;
export type SubscriptionFunction = (
	query: string,
	variables?: Record<string, any>,
) => void;
type NotUndefined<T> = T extends undefined ? never : T;
export type ResolverType<F> = NotUndefined<F extends [infer ARGS, any] ? ARGS : undefined>;



export const ZeusSelect = <T>() => ((t: any) => t) as SelectionFunction<T>;

export const ScalarResolver = (scalar: string, value: any) => {
	switch (scalar) {
		case 'String':
			return `${JSON.stringify(value)}`;
		case 'Int':
			return `${value}`;
		case 'Float':
			return `${value}`;
		case 'Boolean':
			return `${value}`;
		case 'ID':
			return `"${value}"`;
		case 'enum':
			return `${value}`;
		case 'scalar':
			return `${value}`;
		default:
			return false;
	}
};


export const TypesPropsResolver = ({
	value,
	type,
	name,
	key,
	blockArrays
}: {
	value: any;
	type: string;
	name: string;
	key?: string;
	blockArrays?: boolean;
}): string => {
	if (value === null) {
		return `null`;
	}
	let resolvedValue = AllTypesProps[type][name];
	if (key) {
		resolvedValue = resolvedValue[key];
	}
	if (!resolvedValue) {
		throw new Error(`Cannot resolve ${type} ${name}${key ? ` ${key}` : ''}`)
	}
	const typeResolved = resolvedValue.type;
	const isArray = resolvedValue.array;
	const isArrayRequired = resolvedValue.arrayRequired;
	if (typeof value === 'string' && value.startsWith(`ZEUS_VAR$`)) {
		const isRequired = resolvedValue.required ? '!' : '';
		let t = `${typeResolved}`;
		if (isArray) {
			if (isRequired) {
				t = `${t}!`;
			}
			t = `[${t}]`;
			if (isArrayRequired) {
				t = `${t}!`;
			}
		} else {
			if (isRequired) {
				t = `${t}!`;
			}
		}
		return `\$${value.split(`ZEUS_VAR$`)[1]}__ZEUS_VAR__${t}`;
	}
	if (isArray && !blockArrays) {
		return `[${value
			.map((v: any) => TypesPropsResolver({ value: v, type, name, key, blockArrays: true }))
			.join(',')}]`;
	}
	const reslovedScalar = ScalarResolver(typeResolved, value);
	if (!reslovedScalar) {
		const resolvedType = AllTypesProps[typeResolved];
		if (typeof resolvedType === 'object') {
			const argsKeys = Object.keys(resolvedType);
			return `{${argsKeys
				.filter((ak) => value[ak] !== undefined)
				.map(
					(ak) => `${ak}:${TypesPropsResolver({ value: value[ak], type: typeResolved, name: ak })}`
				)}}`;
		}
		return ScalarResolver(AllTypesProps[typeResolved], value) as string;
	}
	return reslovedScalar;
};


const isArrayFunction = (
	parent: string[],
	a: any[]
) => {
	const [values, r] = a;
	const [mainKey, key, ...keys] = parent;
	const keyValues = Object.keys(values).filter((k) => typeof values[k] !== 'undefined');

	if (!keys.length) {
		return keyValues.length > 0
			? `(${keyValues
				.map(
					(v) =>
						`${v}:${TypesPropsResolver({
							value: values[v],
							type: mainKey,
							name: key,
							key: v
						})}`
				)
				.join(',')})${r ? traverseToSeekArrays(parent, r) : ''}`
			: traverseToSeekArrays(parent, r);
	}

	const [typeResolverKey] = keys.splice(keys.length - 1, 1);
	let valueToResolve = ReturnTypes[mainKey][key];
	for (const k of keys) {
		valueToResolve = ReturnTypes[valueToResolve][k];
	}

	const argumentString =
		keyValues.length > 0
			? `(${keyValues
				.map(
					(v) =>
						`${v}:${TypesPropsResolver({
							value: values[v],
							type: valueToResolve,
							name: typeResolverKey,
							key: v
						})}`
				)
				.join(',')})${r ? traverseToSeekArrays(parent, r) : ''}`
			: traverseToSeekArrays(parent, r);
	return argumentString;
};


const resolveKV = (k: string, v: boolean | string | { [x: string]: boolean | string }) =>
	typeof v === 'boolean' ? k : typeof v === 'object' ? `${k}{${objectToTree(v)}}` : `${k}${v}`;


const objectToTree = (o: { [x: string]: boolean | string }): string =>
	`{${Object.keys(o).map((k) => `${resolveKV(k, o[k])}`).join(' ')}}`;


const traverseToSeekArrays = (parent: string[], a?: any): string => {
	if (!a) return '';
	if (Object.keys(a).length === 0) {
		return '';
	}
	let b: Record<string, any> = {};
	if (Array.isArray(a)) {
		return isArrayFunction([...parent], a);
	} else {
		if (typeof a === 'object') {
			Object.keys(a)
				.filter((k) => typeof a[k] !== 'undefined')
				.map((k) => {
					if (k === '__alias') {
						Object.keys(a[k]).map((aliasKey) => {
							const aliasOperations = a[k][aliasKey];
							const aliasOperationName = Object.keys(aliasOperations)[0];
							const aliasOperation = aliasOperations[aliasOperationName];
							b[
								`${aliasOperationName}__alias__${aliasKey}: ${aliasOperationName}`
							] = traverseToSeekArrays([...parent, aliasOperationName], aliasOperation);
						});
					} else {
						b[k] = traverseToSeekArrays([...parent, k], a[k]);
					}
				});
		} else {
			return '';
		}
	}
	return objectToTree(b);
};


const buildQuery = (type: string, a?: Record<any, any>) =>
	traverseToSeekArrays([type], a);


const inspectVariables = (query: string) => {
	const regex = /\$\b\w*__ZEUS_VAR__\[?[^!^\]^\s^,^\)^\}]*[!]?[\]]?[!]?/g;
	let result;
	const AllVariables: string[] = [];
	while ((result = regex.exec(query))) {
		if (AllVariables.includes(result[0])) {
			continue;
		}
		AllVariables.push(result[0]);
	}
	if (!AllVariables.length) {
		return query;
	}
	let filteredQuery = query;
	AllVariables.forEach((variable) => {
		while (filteredQuery.includes(variable)) {
			filteredQuery = filteredQuery.replace(variable, variable.split('__ZEUS_VAR__')[0]);
		}
	});
	return `(${AllVariables.map((a) => a.split('__ZEUS_VAR__'))
		.map(([variableName, variableType]) => `${variableName}:${variableType}`)
		.join(', ')})${filteredQuery}`;
};


export const queryConstruct = (t: 'query' | 'mutation' | 'subscription', tName: string) => (o: Record<any, any>) =>
	`${t.toLowerCase()}${inspectVariables(buildQuery(tName, o))}`;


const fullChainConstruct = (fn: FetchFunction) => (t: 'query' | 'mutation' | 'subscription', tName: string) => (
	o: Record<any, any>,
	variables?: Record<string, any>,
) => fn(queryConstruct(t, tName)(o), variables).then((r: any) => {
	seekForAliases(r)
	return r
});

export const fullChainConstructor = <F extends FetchFunction, R extends keyof ValueTypes>(
	fn: F,
	operation: 'query' | 'mutation' | 'subscription',
	key: R,
) =>
	((o, variables) => fullChainConstruct(fn)(operation, key)(o as any, variables)) as OperationToGraphQL<
		ValueTypes[R],
		GraphQLTypes[R]
	>;


const fullSubscriptionConstruct = (fn: SubscriptionFunction) => (
	t: 'query' | 'mutation' | 'subscription',
	tName: string,
) => (o: Record<any, any>, variables?: Record<string, any>) =>
		fn(queryConstruct(t, tName)(o), variables);

export const fullSubscriptionConstructor = <F extends SubscriptionFunction, R extends keyof ValueTypes>(
	fn: F,
	operation: 'query' | 'mutation' | 'subscription',
	key: R,
) =>
	((o, variables) => fullSubscriptionConstruct(fn)(operation, key)(o as any, variables)) as SubscriptionToGraphQL<
		ValueTypes[R],
		GraphQLTypes[R]
	>;


const seekForAliases = (response: any) => {
	const traverseAlias = (value: any) => {
		if (Array.isArray(value)) {
			value.forEach(seekForAliases);
		} else {
			if (typeof value === 'object') {
				seekForAliases(value);
			}
		}
	};
	if (typeof response === 'object' && response) {
		const keys = Object.keys(response);
		if (keys.length < 1) {
			return;
		}
		keys.forEach((k) => {
			const value = response[k];
			if (k.indexOf('__alias__') !== -1) {
				const [operation, alias] = k.split('__alias__');
				response[alias] = {
					[operation]: value,
				};
				delete response[k];
			}
			traverseAlias(value);
		});
	}
};


export const $ = (t: TemplateStringsArray): any => `ZEUS_VAR$${t.join('')}`;


export const resolverFor = <
	T extends keyof ValueTypes,
	Z extends keyof ValueTypes[T],
	Y extends (
		args: Required<ValueTypes[T]>[Z] extends [infer Input, any] ? Input : any,
		source: any,
	) => Z extends keyof ModelTypes[T] ? ModelTypes[T][Z] | Promise<ModelTypes[T][Z]> : any
>(
	type: T,
	field: Z,
	fn: Y,
) => fn as (args?: any, source?: any) => any;


const handleFetchResponse = (
	response: Parameters<Extract<Parameters<ReturnType<typeof fetch>['then']>[0], Function>>[0]
): Promise<GraphQLResponse> => {
	if (!response.ok) {
		return new Promise((_, reject) => {
			response.text().then(text => {
				try { reject(JSON.parse(text)); }
				catch (err) { reject(text); }
			}).catch(reject);
		});
	}
	return response.json();
};

export const apiFetch = (options: fetchOptions) => (query: string, variables: Record<string, any> = {}) => {
	let fetchFunction;
	let queryString = query;
	let fetchOptions = options[1] || {};
	try {
		fetchFunction = require('node-fetch');
	} catch (error) {
		throw new Error("Please install 'node-fetch' to use zeus in nodejs environment");
	}
	if (fetchOptions.method && fetchOptions.method === 'GET') {
		try {
			queryString = require('querystring').stringify(query);
		} catch (error) {
			throw new Error("Something gone wrong 'querystring' is a part of nodejs environment");
		}
		return fetchFunction(`${options[0]}?query=${queryString}`, fetchOptions)
			.then(handleFetchResponse)
			.then((response: GraphQLResponse) => {
				if (response.errors) {
					throw new GraphQLError(response);
				}
				return response.data;
			});
	}
	return fetchFunction(`${options[0]}`, {
		body: JSON.stringify({ query: queryString, variables }),
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		...fetchOptions
	})
		.then(handleFetchResponse)
		.then((response: GraphQLResponse) => {
			if (response.errors) {
				throw new GraphQLError(response);
			}
			return response.data;
		});
};


export const apiSubscription = (options: chainOptions) => (
	query: string,
	variables: Record<string, any> = {},
) => {
	try {
		const WebSocket = require('ws');
		const queryString = options[0] + '?query=' + encodeURIComponent(query);
		const wsString = queryString.replace('http', 'ws');
		const host = (options.length > 1 && options[1]?.websocket?.[0]) || wsString;
		const webSocketOptions = options[1]?.websocket || [host];
		const ws = new WebSocket(...webSocketOptions);
		return {
			ws,
			on: (e: (args: any) => void) => {
				ws.onmessage = (event: any) => {
					if (event.data) {
						const parsed = JSON.parse(event.data)
						const data = parsed.data
						if (data) {
							seekForAliases(data);
						}
						return e(data);
					}
				};
			},
			off: (e: (args: any) => void) => {
				ws.onclose = e;
			},
			error: (e: (args: any) => void) => {
				ws.onerror = e;
			},
			open: (e: () => void) => {
				ws.onopen = e;
			},
		};
	} catch {
		throw new Error('No websockets implemented. Please install ws');
	}
};


export const Thunder = (fn: FetchFunction, subscriptionFn: SubscriptionFunction) => ({
	query: fullChainConstructor(fn, 'query', 'query_root'),
	mutation: fullChainConstructor(fn, 'mutation', 'mutation_root'),
	subscription: fullSubscriptionConstructor(subscriptionFn, 'subscription', 'subscription_root')
});

export const Chain = (...options: chainOptions) => ({
	query: fullChainConstructor(apiFetch(options), 'query', 'query_root'),
	mutation: fullChainConstructor(apiFetch(options), 'mutation', 'mutation_root'),
	subscription: fullSubscriptionConstructor(apiSubscription(options), 'subscription', 'subscription_root')
});
export const Zeus = {
	query: (o: ValueTypes["query_root"]) => queryConstruct('query', 'query_root')(o),
	mutation: (o: ValueTypes["mutation_root"]) => queryConstruct('mutation', 'mutation_root')(o),
	subscription: (o: ValueTypes["subscription_root"]) => queryConstruct('subscription', 'subscription_root')(o)
};
export const Cast = {
	query: ((o: any) => (_: any) => o) as CastToGraphQL<
		ValueTypes["query_root"],
		GraphQLTypes["query_root"]
	>,
	mutation: ((o: any) => (_: any) => o) as CastToGraphQL<
		ValueTypes["mutation_root"],
		GraphQLTypes["mutation_root"]
	>,
	subscription: ((o: any) => (_: any) => o) as CastToGraphQL<
		ValueTypes["subscription_root"],
		GraphQLTypes["subscription_root"]
	>
};
export const Selectors = {
	query: ZeusSelect<ValueTypes["query_root"]>(),
	mutation: ZeusSelect<ValueTypes["mutation_root"]>(),
	subscription: ZeusSelect<ValueTypes["subscription_root"]>()
};


export const Gql = Chain('http://graphql-engine:8080/v1/graphql')
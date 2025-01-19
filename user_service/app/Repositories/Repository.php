<?php

namespace App\Repositories;

interface Repository
{
    /**
     * Get all column
     *
     * @param array $columns
     */
    public function all($columns = ['*']);

    /**
     * paginate data
     *
     * @param int $perPage
     * @param array $columns
     */
    public function paginate($perPage = 20, $columns = ['*']);

    /**
     * @param array $where
     * @param string $orderBy
     * @param int $perPage
     * @param array $columns
     * @return mixed
     */
    public function paginateWhere(array $where, $orderBy = 'id desc', $perPage = 10, $columns = ['*']);

    /**
     * create one record
     *
     * @param array $data
     * @return mixed
     */
    public function create(array $data);

    /**
     * insert many record
     *
     * @param array $data
     * @return mixed
     */
    public function insert(array $data);

    /**
     * update data
     *
     * @param array $data
     * @param $id
     */
    public function update(array $data, $id);

    /**
     * update with condition
     *
     * @param array $data
     * @param array $where
     * @return mixed
     */
    public function updateWithCondition(array $data, array $where);

    /**
     * @param string $field
     * @param array $value
     * @param array $data
     * @return mixed
     */
    public function updateWhereIn(string $field, array $value, array $data);

    /**
     * @param string $field
     * @param array $value
     * @param array $data
     * @return mixed
     */
    public function updateWhereNotIn(string $field, array $value, array $data);

    /**
     * delete record by ids
     *
     * @param array $ids
     * @return mixed
     */
    public function delete(array $ids);

    /**
     * delete record by conditions
     *
     * @param array $where
     * @return mixed
     */
    public function deleteWithCondition(array $where);

    /**
     * find data by id
     *
     * @param int $id
     * @param array $columns
     */
    public function find($id, $columns = ['*']);

    /**
     * Find data by field and value
     *
     * @param $field
     * @param $value
     * @param array $columns
     * @return mixed
     */
    public function findByField($field, $value, $columns = ['*']);

    /**
     * get data by field and value
     *
     * @param $field
     * @param $value
     * @param array $columns
     * @return mixed
     */
    public function getByField($field, $value, $columns = ['*'], $orderBy = null);

    /**
     * Find data by multiple fields
     *
     * @param array $where
     * @param array $columns
     * @return mixed
     */
    public function findWhere(array $where, $columns = ['*']);

    /**
     * get data by multiple fields
     *
     * @param array $where
     * @param array $columns
     * @return mixed
     */
    public function getWhere(array $where, $columns = ['*'], $orderBy = null);

    /**
     * get data by multiple values in one field
     *
     * @param $field
     * @param array $values
     * @param array $columns
     * @return mixed
     */
    public function getWhereIn($field, array $values, $columns = ['*'], $orderBy = null);

    /**
     * get data by excluding multiple values in one field
     *
     * @param $field
     * @param array $values
     * @param array $columns
     * @return mixed
     */
    public function getWhereNotIn($field, array $values, $columns = ['*'], $orderBy = null);

    /**
     * get data by between values in one field
     *
     * @param $field
     * @param array $values
     * @param array $columns
     * @return mixed
     */
    public function getWhereBetween($field, array $values, $columns = ['*'], $orderBy = null);

    /**
     * @param $attribute
     * @param $operator
     * @param $value
     * @param array $columns
     * @return mixed
     */
    public function getWithOperator($attribute, $operator, $value, $columns = ['*'], $orderBy = null);

    /**
     * @param array $conditions
     * @return mixed
     */
    public function countByMultiCondition($conditions = []);

    /**
     * @param $tableName
     * @param $data
     * @return mixed
     */
    public function insertOrIgnore($tableName, $data = []);

    /**
     * @param array $conditions
     * @param string $groupBy
     * @param array $select
     * @return mixed
     */
    public function getByMultiConditionGroupBy($conditions = [], $groupBy = 'id', $select = ['*']);

    /**
     * insert many record
     *
     * @param array $data
     * @param array $columns
     * @return mixed
     */
    public function insertAndGetId(array $data, array $columns = ['id']): array;
}

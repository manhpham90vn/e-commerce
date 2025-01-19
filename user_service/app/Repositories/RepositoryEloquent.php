<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

abstract class RepositoryEloquent implements Repository
{
    /**
     * @var Model
     */
    protected $model;

    /**
     * Repository constructor.
     */
    public function __construct()
    {
        $this->setModel();
    }

    abstract public function getModel();

    /**
     * set reponsitory instant
     */
    public function setModel()
    {
        $this->model = app()->make(
            $this->getModel()
        );
    }

    public function all($columns = ['*'])
    {
        return $this->model->get($columns);
    }

    public function paginate($perPage = 20, $columns = ['*'])
    {
        return $this->model->paginate($perPage, $columns);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function insert(array $data)
    {
        return $this->model->insert($data);
    }

    public function update(array $data, $id)
    {
        if (is_array($id)) {
            $this->model->whereIn('id', $id)->update($data);
        } else {
            $this->model->where('id', $id)->update($data);
        }
    }

    public function updateWithCondition(array $data, array $where)
    {
        return $this->model->where($where)->update($data);
    }

    public function updateWhereIn(string $field, array $value, array $data)
    {
        return $this->model->whereIn($field, $value)->update($data);
    }

    public function updateWhereNotIn(string $field, array $value, array $data)
    {
        return $this->model->whereNotIn($field, $value)->update($data);
    }

    public function delete(array $ids)
    {
        return $this->model->destroy($ids);
    }

    public function deleteWithCondition(array $where)
    {
        return $this->model->where($where)->delete();
    }

    public function find($id, $columns = ['*'])
    {
        return $this->model->find($id, $columns);
    }

    public function findByField($field, $value, $columns = ['*'])
    {
        return $this->model->where($field, $value)->first($columns);
    }

    public function getByField($field, $value, $columns = ['*'], $orderBy = null)
    {
        $query = $this->model->where($field, $value);

        if ($orderBy) {
            $query = $query->orderByRaw($orderBy);
        }

        return $query->get($columns);
    }

    public function findWhere(array $where, $columns = ['*'])
    {
        return $this->model->where($where)->first($columns);
    }

    public function getWhere(array $where, $columns = ['*'], $orderBy = null)
    {
        $query = $this->model->where($where);

        if ($orderBy) {
            $query = $query->orderByRaw($orderBy);
        }

        return $query->get($columns);
    }

    public function getWhereIn($field, array $values, $columns = ['*'], $orderBy = null)
    {
        $query = $this->model->whereIn($field, $values);

        if ($orderBy) {
            $query = $query->orderByRaw($orderBy);
        }

        return $query->get($columns);
    }

    public function getWhereNotIn($field, array $values, $columns = ['*'], $orderBy = null)
    {
        $query = $this->model->whereNotIn($field, $values);

        if ($orderBy) {
            $query = $query->orderByRaw($orderBy);
        }

        return $query->get($columns);
    }

    public function getWhereBetween($field, array $values, $columns = ['*'], $orderBy = null)
    {
        $query = $this->model->whereBetween($field, $values);

        if ($orderBy) {
            $query = $query->orderByRaw($orderBy);
        }

        return $query->get($columns);
    }

    public function getWithOperator($attribute, $operator, $value, $columns = ['*'], $orderBy = null)
    {
        $query = $this->model->where($attribute, $operator, $value);

        if ($orderBy) {
            $query = $query->orderByRaw($orderBy);
        }

        return $query->get($columns);
    }

    public function countByMultiCondition($conditions = [])
    {
        return $this->model->where($conditions)->count();
    }

    public function insertOrIgnore($tableName, $data = [])
    {
        DB::table($tableName)->insertOrIgnore($data);
    }

    public function getByMultiConditionGroupBy($conditions = [], $groupBy = 'id', $select = ['*'], $orderBy = null)
    {
        return $this->model
            ->select($select)
            ->where($conditions)
            ->groupBy($groupBy)
            ->orderByRaw($orderBy)
            ->get();
    }

    public function paginateWhere(array $where, $perPage = 10, $columns = ['*'], $orderBy = null)
    {
        $query = $this->model->where($where);

        if ($orderBy) {
            $query = $query->orderByRaw($orderBy);
        }

        return $query->paginate($perPage, $columns);
    }

    public function insertAndGetId(array $data, array $columns = ['id']): array
    {
        $result = [];

        foreach ($data as $key => $value) {
            $item = $this->model->create($value);

            foreach ($columns as $column) {
                $result[$key][$column] = $item->$column;
            }
        }

        return $result;
    }
}

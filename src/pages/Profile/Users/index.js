import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { message, Table } from 'antd';
import { ShowLoading, HideLoading } from '../../../redux/loadersSlice';
import moment from "moment";
import { GetAllUsers } from '../../../apiCalls/users';
import Button from '../../../components/Button';
import IssuedBooks from './IssuedBooks';

function Users({ role }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showIssuedBooks, setShowIssuedBooks] = useState(false);
  const [users, setUsers] = React.useState([]);
  const dispatch = useDispatch();
  const getUsers = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetAllUsers(role);
      dispatch(HideLoading());
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",

    },
    {
      title: "Name",
      dataIndex: "name",

    },
    {
      title: "Email",
      dataIndex: "email",

    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (createdAt) => moment(createdAt).format("DD-MM-YYYY hh:mm A"),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (actions, record) => (
        <div>
          <Button
            title="Books"
            variant="outlined"
            onClick={() => {
              setSelectedUser(record);
              setShowIssuedBooks(true);
            }}
          />
        </div>
      ),
    }
  ];

  return (
    <div>
      <Table dataSource={users} columns={columns} />

      {showIssuedBooks && <IssuedBooks
        showIssuedBooks={showIssuedBooks}
        setShowIssuedBooks={setShowIssuedBooks}
        selectedUser={selectedUser} />}
    </div>
  )
}

export default Users;
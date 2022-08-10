import React, { useState, useEffect, Component } from 'react';
import './memberList.css';

import axios from 'axios';

import { DataGrid } from '@mui/x-data-grid';
import { DeleteOutline } from '@mui/icons-material';

import { Link } from 'react-router-dom';

export default function MemberList(props) {
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      renderCell: (params) => {
        return <Link to={`/members/${params.row.id}`}>{params.row.id}</Link>;
      },
    },
    { field: 'socialId', headerName: 'Social Id', width: 130 },
    { field: 'socialNickname', headerName: 'Social Nickname', width: 130 },

    {
      field: 'profileUrl',
      headerName: 'Profile',
      width: 70,
      renderCell: (params) => {
        return (
          <div className="memberListMember">
            <img className="memberListImg" src={params.row.profileUrl} alt="" />
          </div>
        );
      },
    },
    {
      field: 'nickname',
      headerName: 'Nickname',
      width: 150,
    },

    { field: 'createdAt', headerName: '가입일', width: 250 },
    { field: 'updatedAt', headerName: '닉네임 변경일', width: 250 },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <DeleteOutline
              className="memberListDelete"
              onClick={() => axios.delete(`${props.API_URI}/members/${params.row.id}`, headers)}
            />
          </>
        );
      },
    },
  ];

  const [memberRows, setMemberRows] = useState([]);
  const headers = {
    headers: {
      Authorization: 'Bearer ' + props.accessToken,
    },
  };

  useEffect(() => {
    axios.get(`${props.API_URI}/members`, headers).then((res) => {
      if (res.data) {
        console.log(res.data);
        setMemberRows(res.data.members);
      } else {
        alert('failed to ');
      }
    });
  }, []);

  return (
    <div className="memberList">
      <DataGrid
        rows={memberRows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>
  );
}

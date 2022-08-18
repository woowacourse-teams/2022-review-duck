import React, { useState, useEffect } from 'react';
import './templateList.css';

import axios from 'axios';

import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { DeleteOutline } from '@mui/icons-material';

export default function TemplateList(props) {
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      renderCell: (params) => {
        return <Link to={`/templates/${params.row.id}`}>{params.row.id}</Link>;
      },
    },
    {
      field: 'memberId',
      headerName: 'Member Id',
      width: 130,
      renderCell: (params) => {
        return <Link to={`/members/${params.row.memberId}`}>{params.row.memberId}</Link>;
      },
    },
    {
      field: 'memberProfileUrl',
      headerName: 'Member Profile',
      width: 160,
      renderCell: (params) => {
        return (
          <div className="templateListMember">
            <img className="templateListMemberImg" src={params.row.memberProfileUrl} alt="" />
            {params.row.memberNickname}
          </div>
        );
      },
    },

    { field: 'templateTitle', headerName: 'Template Title', width: 160 },
    { field: 'templateDescription', headerName: 'Template Description', width: 250 },
    { field: 'usedCount', headerName: 'Used Count', width: 160 },

    { field: 'createdAt', headerName: '생성일', width: 250 },
    { field: 'updatedAt', headerName: '최종 수정일', width: 250 },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <DeleteOutline
              className="templateListDelete"
              onClick={() => axios.delete(`${props.API_URI}/templates/${params.row.id}`, headers)}
            />
          </>
        );
      },
    },
  ];
  const [templateRows, setTemplateRows] = useState([]);
  const headers = {
    headers: {
      Authorization: 'Bearer ' + props.accessToken,
    },
  };

  useEffect(() => {
    axios.get(`${props.API_URI}/templates`, headers).then((res) => {
      if (res.data) {
        console.log(res.data);
        setTemplateRows(res.data.templates);
      } else {
        alert('failed to ');
      }
    });
  }, []);

  return (
    <div className="templateList">
      <DataGrid
        rows={templateRows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './reviewForm.css';
import axios from 'axios';

import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { DeleteOutline } from '@mui/icons-material';

export default function ReviewForm(props) {
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      renderCell: (params) => {
        return <Link to={`/reviews/${params.row.id}`}>{params.row.id}</Link>;
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
          <div className="reviewformListMember">
            <img className="reviewFormListMemberImg" src={params.row.memberProfileUrl} alt="" />
            {params.row.memberNickname}
          </div>
        );
      },
    },
    {
      field: 'reviewFormCode',
      headerName: 'Review Form Code',
      width: 160,
      renderCell: (params) => {
        return (
          <Link to={`/review-forms/${params.row.reviewFormCode}`}>{params.row.reviewFormCode}</Link>
        );
      },
    },
    { field: 'reviewFormTitle', headerName: 'Review Form Title', width: 160 },

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
              className="reviewListDelete"
              onClick={() => axios.delete(`${props.API_URI}/reviews/${params.row.id}`, headers)}
            />
          </>
        );
      },
    },
  ];

  const params = useParams();
  const [reviewRows, setReviewRows] = useState([]);
  const headers = {
    headers: {
      Authorization: 'Bearer ' + props.accessToken,
    },
  };

  useEffect(() => {
    axios
      .get(`${props.API_URI}/review-forms/${params.reviewFormCode}/reviews`, headers)
      .then((res) => {
        if (res.data) {
          console.log(res.data);
          setReviewRows(res.data.reviews);
        } else {
          alert('failed to ');
        }
      });
  }, []);

  return (
    <div className="reviewList">
      <DataGrid
        rows={reviewRows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>
  );
}

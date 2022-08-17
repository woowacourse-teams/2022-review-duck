import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './reviewForm.css';
import axios from 'axios';

import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { DeleteOutline } from '@mui/icons-material';

export default function ReviewForm(props) {
  const questionColumns = [
    { field: 'id', headerName: 'Question ID', width: 150 },
    { field: 'value', headerName: 'Question Value', width: 250 },
    { field: 'description', headerName: 'Question Description', width: 250 },
  ];

  const reviewColumns = [
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
  const [reviewFormInfo, setReviewFormInfo] = useState([]);
  const [questionRows, setQuestionRows] = useState([]);
  const [reviewRows, setReviewRows] = useState([]);
  const headers = {
    headers: {
      Authorization: 'Bearer ' + props.accessToken,
    },
  };

  useEffect(() => {
    axios.get(`${props.API_URI}/review-forms/${params.reviewFormCode}`, headers).then((res) => {
      if (res.data) {
        console.log(res.data);
        setReviewFormInfo(res.data.reviewFormInfo);
        setQuestionRows(res.data.questions);
        setReviewRows(res.data.reviews);
      } else {
        alert('failed to ');
      }
    });
  }, []);

  return (
    <div className="reviewList">
      <div className="reviewFormInfo">
        <ul>
          <li>
            <span>ReviewForm Id </span>
            {reviewFormInfo.id}
          </li>
          <li>
            <span>ReviewForm Code </span>
            {reviewFormInfo.id}
          </li>
          <li>
            <span>Author Id </span>
            {reviewFormInfo.memberId}
          </li>
          <li>
            <span>Author Profile</span>
            {reviewFormInfo.memberProfile}
          </li>
          <li>
            <span>Author Nickname </span>
            {reviewFormInfo.memberNickname}
          </li>
          <li>
            <span>ReviewForm Title </span>
            {reviewFormInfo.templateTitle}
          </li>
          <li>
            <span>작성일 </span>
            {reviewFormInfo.createdAt}
          </li>
          <li>
            <span>최종 수정일 </span>
            {reviewFormInfo.updatedAt}
          </li>
        </ul>
      </div>
      <DataGrid
        rows={questionRows}
        columns={questionColumns}
        pageSize={10}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
      <DataGrid
        rows={reviewRows}
        columns={reviewColumns}
        pageSize={10}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>
  );
}

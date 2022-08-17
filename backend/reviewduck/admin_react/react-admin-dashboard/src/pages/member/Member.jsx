import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './member.css';
import axios from 'axios';

import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { DeleteOutline } from '@mui/icons-material';

export default function Member(props) {
  const templateColumns = [
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

  const reviewFormColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'code',
      headerName: 'ReviewForm Code',
      width: 160,
      renderCell: (params) => {
        return <Link to={`/review-forms/${params.row.code}`}>{params.row.code}</Link>;
      },
    },
    { field: 'reviewTitle', headerName: 'Review Title', width: 160 },
    {
      field: 'memberId',
      headerName: 'Member Id',
      width: 90,
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

    { field: 'active', headerName: 'isActive', width: 130 },
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
              className="reviewFormListDelete"
              onClick={() =>
                axios.delete(`${props.API_URI}/review-forms/${params.row.id}`, headers)
              }
            />
          </>
        );
      },
    },
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
  const [memberInfo, setMemberInfoRow] = useState([]);
  const [templateRows, setTemplateRows] = useState([]);
  const [reviewFormRows, setReviewFormRows] = useState([]);
  const [reviewRows, setReviewRows] = useState([]);
  const headers = {
    headers: {
      Authorization: 'Bearer ' + props.accessToken,
    },
  };

  useEffect(() => {
    axios.get(`${props.API_URI}/members/${params.memberId}`, headers).then((res) => {
      if (res.data) {
        console.log(res.data);
        setMemberInfoRow(res.data);
      } else {
        alert('failed to ');
      }
    });
  }, []);

  useEffect(() => {
    axios.get(`${props.API_URI}/templates?memberId=${params.memberId}`, headers).then((res) => {
      if (res.data) {
        console.log(res.data);
        setTemplateRows(res.data.templates);
      } else {
        alert('failed to ');
      }
    });
  }, []);

  useEffect(() => {
    axios.get(`${props.API_URI}/review-forms?memberId=${params.memberId}`, headers).then((res) => {
      if (res.data) {
        console.log(res.data);
        setReviewFormRows(res.data.reviewForms);
      } else {
        alert('failed to ');
      }
    });
  }, []);

  useEffect(() => {
    axios.get(`${props.API_URI}/reviews?memberId=${params.memberId}`, headers).then((res) => {
      if (res.data) {
        console.log(res.data);
        setReviewRows(res.data.reviews);
      } else {
        alert('failed to ');
      }
    });
  }, []);

  return (
    <div className="member">
      <div className="memberInfo">
        <ul>
          <li>
            <span>Member Id </span>
            {memberInfo.id}
          </li>
          <li>
            <span>Social Id </span>
            {memberInfo.socialId}
          </li>
          <li>
            <span>Social Nickname</span>
            {memberInfo.socialNickname}
          </li>
          <li>
            <span>Profile and Nickname </span>
            <div className="infoMember">
              <img className="infoMemberImg" src={memberInfo.memberProfileUrl} alt="" />
              {memberInfo.memberNickname}
            </div>
          </li>
          <li>
            <span>Template Title </span>
            {memberInfo.templateTitle}
          </li>
          <li>
            <span>Template Description </span>
            {memberInfo.templateDescription}
          </li>
          <li>
            <span>Used Count </span>
            {memberInfo.usedCount}
          </li>
          <li>
            <span>작성일 </span>
            {memberInfo.createdAt}
          </li>
          <li>
            <span>최종 수정일 </span>
            {memberInfo.updatedAt}
          </li>
        </ul>
      </div>
      <DataGrid
        rows={templateRows}
        columns={templateColumns}
        pageSize={10}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
      <DataGrid
        rows={reviewFormRows}
        columns={reviewFormColumns}
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

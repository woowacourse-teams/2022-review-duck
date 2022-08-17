import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './template.css';
import axios from 'axios';

import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'Question ID', width: 150 },
  { field: 'value', headerName: 'Question Value', width: 250 },
  { field: 'description', headerName: 'Question Description', width: 250 },
];

export default function Template(props) {
  const params = useParams();
  const [templateInfo, setTemplateInfoRow] = useState([]);
  const [questionRows, setQuestionRows] = useState([]);
  const headers = {
    headers: {
      Authorization: 'Bearer ' + props.accessToken,
    },
  };
  useEffect(() => {
    axios.get(`${props.API_URI}/templates/${params.templateId}`, headers).then((res) => {
      if (res.data) {
        console.log(res.data);
        setTemplateInfoRow(res.data.templateInfo);
        setQuestionRows(res.data.questions);
      } else {
        alert('failed to ');
      }
    });
  }, []);

  return (
    <div className="template">
      <div className="templateInfo">
        <ul>
          <li>
            <span>Template Id </span>
            {templateInfo.id}
          </li>
          <li>
            <span>Author Id </span>
            {templateInfo.memberId}
          </li>
          <li>
            <span>Author Profile</span>
            {templateInfo.memberProfile}
          </li>
          <li>
            <span>Author Nickname </span>
            {templateInfo.memberNickname}
          </li>
          <li>
            <span>Template Title </span>
            {templateInfo.templateTitle}
          </li>
          <li>
            <span>Template Description </span>
            {templateInfo.templateDescription}
          </li>
          <li>
            <span>Used Count </span>
            {templateInfo.usedCount}
          </li>
          <li>
            <span>작성일 </span>
            {templateInfo.createdAt}
          </li>
          <li>
            <span>최종 수정일 </span>
            {templateInfo.updatedAt}
          </li>
        </ul>
      </div>
      <DataGrid
        rows={questionRows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>
  );
}

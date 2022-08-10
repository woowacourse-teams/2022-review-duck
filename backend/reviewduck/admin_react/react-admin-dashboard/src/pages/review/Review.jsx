import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom";
import './review.css'
import axios from "axios"

import { DataGrid } from '@mui/x-data-grid'

const columns = [
    { field: 'id', headerName: 'QuestionAnswer ID', width: 150 },
    { field: 'questionId', headerName: 'Question ID', width: 150 },
    { field: 'questionValue', headerName: 'Question Value', width: 250 },
    { field: 'answerId', headerName: 'Answer ID', width: 150 },
    { field: 'answerValue', headerName: 'Answer Value', width: 250 },
  ]

export default function Review(props) {
    const params = useParams();
    const [reviewInfo, setReviewInfoRow] = useState([])
    const [questionAnswerRows, setQuestionAnswerRows] = useState([])
    const headers = {
        headers: {
          Authorization: 'Bearer ' + props.accessToken 
        }}
    useEffect(() => {
        axios.get(`${props.API_URI}/reviews/${params.reviewId}`, headers).then((res)=>{
          if(res.data){
            console.log(res.data);
            setReviewInfoRow(res.data.reviewInfo);
            setQuestionAnswerRows(res.data.questionAnswers);
          }else{
            alert("failed to ");
          }
        });
        },[]);

    return (
        <div className="review">
            <div className='reviewInfo'>
                <ul>
                    <li>
                        <span>Review Id     </span>
                        {reviewInfo.id}
                    </li>
                    <li>
                        <span>Author Id     </span>
                        {reviewInfo.memberId}
                    </li>
                    <li>
                        <span>Author Profile</span>
                        {reviewInfo.memberProfile}
                    </li>
                    <li>
                        <span>Author Nickname     </span>
                        {reviewInfo.memberNickname}
                    </li>
                    <li>
                        <span>ReviewForm Code     </span>
                        {reviewInfo.reviewFormCode}
                    </li>
                    <li>
                        <span>ReviewForm Title     </span>
                        {reviewInfo.reviewFormTitle}
                    </li>
                    <li>
                        <span>작성일     </span>
                        {reviewInfo.createdAt}
                    </li>
                    <li>
                        <span>최종 수정일     </span>
                        {reviewInfo.updatedAt}
                    </li>
                </ul>
            </div>
            <DataGrid
                rows={questionAnswerRows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[5]}
                checkboxSelection
            />
        </div>
    )
}
import React, { useState, useEffect } from "react"
import './reviewList.css'

import axios from "axios"

import { DataGrid } from '@mui/x-data-grid'

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'memberId', headerName: 'Member Id', width: 130 },
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
        )
    },
  },
  { field: 'reviewFormCode', headerName: 'Review Form Code', width: 160 },
  { field: 'reviewFormTitle', headerName: 'Review Form Title', width: 160 },

  
  { field: 'createdAt', headerName: '생성일', width: 250 },
  { field: 'updatedAt', headerName: '최종 수정일', width: 250 },
]


export default function ReviewList(){
    const [reviewRows, setReviewRows] = useState([])
    
    useEffect(() => {
        axios.get("http://localhost:8080/api/admin/reviews").then((res)=>{
          if(res.data){
            console.log(res.data);
            setReviewRows(res.data.reviews);
          }else{
            alert("failed to ");
          }
        });
        },[]);

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
    )
}

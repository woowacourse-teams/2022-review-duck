import React, { useState, useEffect } from "react"
import './memberList.css'

import axios from "axios"

import { DataGrid } from '@mui/x-data-grid'
import { DeleteOutline } from '@mui/icons-material'

import {Link} from 'react-router-dom'

const columns = [
  { field: 'id', headerName: 'ID', width: 70,
renderCell:(params)=>{
  return <Link to={`/members/${params.row.id}`}>
    {params.row.id}
  </Link>
}},
  { field: 'socialId', headerName: 'Social Id', width: 130 },
  { field: 'socialNickname', headerName: 'Social Nickname', width: 130 },
  {
    field: 'nickname',
    headerName: 'Nickname',
    width: 90,
  },
  {
    field: 'profileUrl',
    headerName: 'Profile',
    width: 160,
    renderCell: (params) => {
        return (
            <div className="memberListMember">
                <img className="memberListImg" src={params.row.profileUrl} alt="" />
                {params.row.nickname}
            </div>
        )
    },
  },
  
  { field: 'createdAt', headerName: '가입일', width: 250 },
  { field: 'updatedAt', headerName: '닉네임 변경일', width: 250 },
  { field: 'action', headerName: 'Action', width: 150, 
  renderCell: (params)=>{
    return (
      <>
        <DeleteOutline 
        className='memberListDelete' 
        onClick={()=>axios.delete(`http://localhost:8080/api/admin/members/${params.row.id}`)}
        />
      </>
    )
  },
},
]


export default function MemberList(){
    const [memberRows, setMemberRows] = useState([])

    useEffect(() => {
        axios.get(`http://localhost:8080/api/admin/members`).then((res)=>{
          if(res.data){
            console.log(res.data);
            setMemberRows(res.data.members);
          }else{
            alert("failed to ");
          }
        });
        },[]);

    return (
        <div className="memberList">
            <DataGrid
                rows={memberRows}
                disableSelectionOnClick
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[5]}
                checkboxSelection
            />
        </div>
    )
}

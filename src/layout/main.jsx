import React, { useState,useEffect } from 'react';
import Header from '../components/appbar'
import './login.css'
import { loginWithToken } from '../api/loginChat'
import WebIM from '../utils/WebIM';
import { EaseApp } from 'chat-uikit'
import { createHashHistory } from 'history'
import store from '../redux/store'
import { setMyUserInfo} from '../redux/actions'
import SessionInfoPopover from '../components/appbar/sessionInfo'
import GroupMemberInfoPopover from '../components/appbar/chatGroup/memberInfo'
import { Report } from '../components/report';
import i18next from "i18next";

const history = createHashHistory()

export default function Main() {
    useEffect(() => {
        const webimAuth = sessionStorage.getItem('webim_auth')
        let webimAuthObj = {}
        if (webimAuth && WebIM.conn.logOut) {
            webimAuthObj = JSON.parse(webimAuth)
            loginWithToken(webimAuthObj.agoraId, webimAuthObj.accessToken)
            store.dispatch(setMyUserInfo({ agoraId: webimAuthObj.agoraId, nickName: webimAuthObj.nickName }))
        }else if (WebIM.conn.logOut) {
            history.push('/login')  
        }
    }, [])
    const state = store.getState();
    const [sessionInfoAddEl, setSessionInfoAddEl] = useState(null)
    const [sessionInfo, setSessionInfo] = useState({});

    const [groupMemberInfoAddEl, setGroupMemberInfoAddEl] = useState(null)
    const [memberInfo, setMemberInfo] = useState({})

    const [isShowReport, setShowReport] = useState(false)
    const [currentMsg, setCurrentMsg] = useState({})
    // session avatar click
    const handleClickSessionInfoDialog = (e,res) => {
        // TODO 
        let isSingleChat = res.chatType === "singleChat"
        if (isSingleChat) {
            setSessionInfoAddEl(e.target);
            setSessionInfo(res)
        }
    }

    const handleClickGroupMemberInfoDialog = (e,res) => {
        let isGroupChat = res.chatType === "groupChat"
        if (isGroupChat) {
            setGroupMemberInfoAddEl(e.target);
            setMemberInfo(res)
        }
    }

    const onMessageEventClick = (e,data,msg) => {
        if(data.value === 'report'){
            setShowReport(true)
            setCurrentMsg(msg)
        }        
    }

    return (
        <div className='main-container'>
            <EaseApp
                isShowReaction={true}
                header={<Header />}
                onChatAvatarClick={handleClickSessionInfoDialog}
                onAvatarChange={handleClickGroupMemberInfoDialog}
                customMessageList={[{name: i18next.t("Report"), value: 'report'}]}
                customMessageClick={onMessageEventClick}
            />
            <SessionInfoPopover 
                open={sessionInfoAddEl}
                onClose={() => setSessionInfoAddEl(null)}
                sessionInfo={sessionInfo}/>
            <GroupMemberInfoPopover 
                open={groupMemberInfoAddEl}
                onClose={() => setGroupMemberInfoAddEl(null)}
                memberInfo={memberInfo}/>
            <Report open={isShowReport} onClose={() => {setShowReport(false)}} currentMsg={currentMsg}/>
        </div>
    )
}


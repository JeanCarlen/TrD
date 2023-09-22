import React from 'react'
import * as FaIcons from 'react-icons/fa'

export const SidebarData = [
    // {
    //     title: 'SignIn',
    //     path: '/login' ,
    //     icon: <FaIcons.FaCrow />
    // },
    {
        title: 'Home',
        path: '/Home',
        icon: <FaIcons.FaHome />
    },
    // {
    //     title: 'Users',
    //     path: '/users',
    //     icon: <FaIcons.FaUsers />
    // },
    {
        title: 'Lets Play!',
        path: '/game',
        icon: <FaIcons.FaGamepad />
    },
    {
        title: 'Chats',
        path: '/chats',
        icon: <FaIcons.FaRocketchat />
    },
    {
        title: 'Statistics',
        path: '/statistics',
        icon: <FaIcons.FaRegChartBar />
    },
    {
        title: 'Log Out',
        path: '/logout',
        icon: <FaIcons.FaSignOutAlt />
    }
]

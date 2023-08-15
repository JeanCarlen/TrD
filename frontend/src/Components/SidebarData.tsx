import React from 'react'
import * as FaIcons from 'react-icons/fa'

export const SidebarData = [
    {
        title: 'Home',
        path: '/',
        icon: <FaIcons.FaHome />
    },
    {
        title: 'Users',
        path: '/users',
        icon: <FaIcons.FaUsers />
    },
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
    }
]

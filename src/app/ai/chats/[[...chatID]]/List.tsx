'use client';

import { useEffect } from 'react';

// 会话列表
export function ListItem() {}

interface IProps {}

export default function List(props: IProps) {
  useEffect(() => {
    fetchUserChats();
  });

  async function fetchUserChats() {
    const response = await fetch('/api/user/chats');
    const { Response } = await response.json();
    console.log({ Response });
  }
  return <div></div>;
}

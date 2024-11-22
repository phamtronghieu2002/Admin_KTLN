import { FC } from "react"

import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
interface TabWrapperProps {
    items: TabsProps['items']
}


const onChange = (key: string) => {
    console.log(key);
  };
  

const TabWrapper: FC<TabWrapperProps> = ({
    items
}) => {
  return <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;
}

export default TabWrapper

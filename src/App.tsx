import { BrowserRouter, Route, Routes } from "react-router-dom"
import { routes } from "./routes"
import { NavigateProvider } from "./providers/NavigateProvider"
import { Modal, message, notification } from "antd"
import { useNotification } from "./hooks/useNodification"
import { useMessage } from "./hooks/useMessage"
import { useModal } from "./hooks/useModal"
import "animate.css"




export const App: React.FC = () => {




  const [notifyAPI, contextHolder] = notification.useNotification()
  const [messageApi, contextMsgHolder] = message.useMessage()
  const [modal, contextModalHolder] = Modal.useModal()

  useNotification(notifyAPI)
  useMessage(messageApi)
  useModal(modal)

  return (
    <>
      <BrowserRouter>
        <Routes>
          {routes.map((route, index) => {
            const Layout: any = route.layout
            const Page = route.component
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <NavigateProvider>
                    <Layout
                      useMenu={route?.useMenu}
                      useFullScreen={route?.useFullScreen}
                      useMonitor={route?.useMonitor}
                      useTab={route?.useTab}
                    >
                      {Page ? <Page /> : null}
                    </Layout>
                  </NavigateProvider>
                }
              />
            )
          })}
        </Routes>
      </BrowserRouter>

      {contextHolder}
      {contextMsgHolder}
      {contextModalHolder}
    </>
  )
}

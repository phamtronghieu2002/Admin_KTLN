import { Fragment, ReactNode } from "react"
import { routeConfig } from "../configs/routeConfig"

import { MainLayout } from "../layouts/MainLayout"
import { Login } from "../pages/Login"
import { LoginLayout } from "../layouts/LoginLayout"

import { RootPage } from "../pages/Root"
import Listening from "../pages/Manager/ManagerCategories/Listening/Listening"
import Reading from "../pages/Manager/ManagerCategories/Reading/Reading"
import Policy from "../pages/Manager/ManagerPolicy/Policy"
import Term from "../pages/Manager/ManagerTerm/Term"
import Users from "../pages/Manager/ManagerUser/Users"
import Introduction from "../pages/Manager/Introduction"
import Speaking from "../pages/Manager/ManagerCategories/Speaking/Speaking"
import Writing from "../pages/Manager/ManagerCategories/Writing/Writing"
import Grammar from "../pages/Manager/ManagerCategories/Grammar/Grammar"
import Vocabulary from "../pages/Manager/ManagerCategories/Vocabulary/Vocabulary"
import Exam from "../pages/Manager/ManagerCategories/Exam/Exam"

export interface IRoute {
  path: string
  component: React.FC<{}> | null
  layout: React.FC<{ children: ReactNode }>
  useMenu?: boolean
  useFullScreen?: boolean
  useMonitor?: boolean
  useTab?: boolean
}

export const routes: IRoute[] = [
  {
    path: routeConfig?.login,
    component: Login,
    layout: LoginLayout,
  },
  //LOGIN
  {
    path: routeConfig?.root,
    component: RootPage,
    layout: MainLayout,
    useFullScreen: true,
  },

  //PRIVATE
  {
    path: routeConfig?.manager,
    component: Introduction,
    layout: MainLayout,
    useFullScreen: true,
    // useMonitor: true,
  },
  {
    path: routeConfig?.manager_listening,
    component: Listening,
    layout: MainLayout,
  },
  {
    path: routeConfig?.manager_exam,
    component: Exam,
    layout: MainLayout,
  },
  {
    path: routeConfig?.manager_reading,
    component: Reading,
    layout: MainLayout,
  },
  {
    path: routeConfig?.manager_speaking,
    component: Speaking,
    layout: MainLayout,
  },
  {
    path: routeConfig?.manager_grammar,
    component: Grammar,
    layout: MainLayout,
  },
  {
    path: routeConfig?.manager_vocabulary,
    component: Vocabulary,
    layout: MainLayout,
  },
  {
    path: routeConfig?.manager_writing,
    component: Writing,
    layout: MainLayout,
  },
  {
    path: routeConfig?.manager_policy,
    component: Policy,
    layout: MainLayout,
  },
  {
    path: routeConfig?.manager_term,
    component: Term,
    layout: MainLayout,
  },
  {
    path: routeConfig?.manager_user,
    component: Users,
    layout: MainLayout,
  },
]

export const routesObj: { [key: string]: IRoute } = {}

routes?.forEach?.((route) => {
  if (route?.path) {
    routesObj[route?.path] = route
  }
})

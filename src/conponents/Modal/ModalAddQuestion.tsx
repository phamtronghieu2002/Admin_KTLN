import React, { FC, useContext, useEffect, useRef, useState } from "react"
import { ModalCView } from "../ModalC/ModalC"
import { FormC } from "../FormC"
import { Button } from "antd"
import { CloseOutlined } from "@ant-design/icons"
import { _log } from "../../utils/_log"
import { MaskLoader } from "../Loader"
import { FormInstance } from "antd/lib"
import { api } from "../../_helper"
import { context } from "../Draw/provider/DrawProvider"
import { _questionType } from "../../utils/_constant"
import { IconC } from "../IconC"
import { deleteQuestionById } from "../../services/questionServices"
import { deleteTestResult } from "../../services/testResultServices"
import QuestionManager from "./components/QuestionEditor"

interface ModalquestionProps {
  button: React.ReactNode
  title: string
  type: "add" | "update" | "delete"
  data?: any
  modalProps?: any
  lesson_id: string
  test_id: string
  width?: number
  height?: number
  refresh?: any
}

interface ModalFormProps {
  action: any
  type: "add" | "update" | "delete"
  data?: any
  lesson_id: string
  test_id: string
  refresh?: any
}

const ModalForm: FC<ModalFormProps> = ({
  action,
  type,
  data,
  lesson_id,
  refresh,
  test_id,
}) => {
  return (
    <div>
      <QuestionManager lesson_id={lesson_id} action={action}/>
    </div>
  )
}

const ModalAddQuestion: FC<ModalquestionProps> = ({
  button,
  title,
  type,
  data,
  modalProps,
  lesson_id,
  refresh,
  test_id,
  width = 800,
  height = 600,
}) => {
  return (
    <ModalCView
      modalProps={{
        width: 1200,
        height: 600,
        ...modalProps,
      }}
      button={button}
      title={title}
      children={(action) => (
        <ModalForm
          test_id={test_id}
          refresh={refresh}
          data={data}
          action={action}
          type={type}
          lesson_id={lesson_id}
        />
      )}
    />
  )
}

export default ModalAddQuestion

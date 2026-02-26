import React from 'react'
import { Contaner, PostForm } from '../components'


const AddPost = () => {
  return (
    <div className='pt-32 pb-16 min-h-screen bg-gray-50 dark:bg-slate-900'>
      <Contaner>
        <PostForm />
      </Contaner>
    </div>
  )
}

export default AddPost

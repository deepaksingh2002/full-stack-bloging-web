import React, { useEffect } from 'react'
import { Contaner, PostForm } from '../components'
import { getPostById } from '../features/post/postThunks'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'


function EditPost() {
    const { post, loading } = useSelector(state => state.post);
    const { slug } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch();

    useEffect(() => {
        if (slug) {
            dispatch(getPostById(slug));
        } else {
            navigate('/')
        }
    }, [slug, navigate, dispatch])

    return loading ? <div>Loading...</div> : post ? (
        <div className='py-8'>
            <Contaner>
                <PostForm post={post} />
            </Contaner>
        </div>
    ) : null
}

export default EditPost

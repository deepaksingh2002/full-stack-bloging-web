import React, { useId } from 'react'

const Input = React.forwardRef(function Input({
    lable,
    label,
    type="text",
    className="",
    ...props
}, ref){
    const id = useId()
    const resolvedLabel = label ?? lable;
    return (
        <div className='w-full'>
            {resolvedLabel && <label
             className='inline-block mb-1 pl-1 text-gray-800 dark:text-slate-200' 
            htmlFor={id}>
                        {resolvedLabel}
                    </label>}
                    <input type={type} 
                    className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:focus:bg-slate-900 ${className}`}
                     ref={ref}
                     {...props}
                     id={id}
                     />
        </div>
    )
}
)

export default Input


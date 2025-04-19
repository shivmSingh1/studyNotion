import React from 'react'

function Button({ btnColor, btnText }) {
	return (
		<div className={`${btnColor} p-1 px-1 rounded-md`}>{btnText}</div>
	)
}

export default Button
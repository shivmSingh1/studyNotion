import React from 'react'
import Button from '../components/homepage/Button'
// import MapPicker from '../components/MapPicker'
import banner from "../assets/Images/banner.mp4"
import CodeBlocks from '../components/homepage/CodeBlocks'

const Home = () => {
	return (
		<div className=' w-11/12 max-w-maxContent mx-auto'>
			<div className=' flex w-[90%] justify-center mx-auto flex-col items-center'>
				<div className='mt-3'>
					<div><button className='text-white bg-richblack-500 p-1 rounded-md'>Become an instuctor -&gt;</button>
					</div>
				</div>
				<div className='text-white mt-4 text-center'>
					<h4>Empower your future with <span className='text-yellow-200'>coding skills</span></h4>
					<p className='text-richblack-400 mt-2'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsa veniam pariatur nisi deserunt hic. Quibusdam impedit facere tenetur fugiat corporis suscipit quas deleniti, nostrum harum doloribus quam!</p>
				</div>
				<div className='flex space-x-2 mt-3'>
					<Button btnText={"Learn Demo"} btnColor={"bg-yellow-300"} ></Button>
					<Button btnText={"Book a demo"} btnColor={"bg-richblack-500"} ></Button>
				</div>
			</div>

			<div className='w-[800px] mx-auto mt-4'>
				<video width="800" autoPlay muted loop>
					<source src={banner} type="video/mp4" />
					Your browser does not support the video tag.
				</video>
			</div>

			<CodeBlocks />
		</div>
	)
}

export default Home
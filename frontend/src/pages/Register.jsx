import RegisterForm from '../components/auth/RegisterForm'

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-dark-800 to-dark-900"></div>
      <div className="relative w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  )
}

export default Register

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import axios from 'axios' // Import axios
import {
  X,
  Upload,
  Image as ImageIcon,
  AlertTriangle,
  Megaphone,
  CheckCircle
} from 'lucide-react'
import Modal from '../common/Modal'
import Button from '../common/Button'
import Input from '../common/Input'
import { useAuth } from '../../contexts/AuthContext' // Import useAuth

const API_BASE_URL = 'http://localhost:5000/api'

const CreatePost = ({ isOpen, onClose, onPostCreated }) => { // Add onPostCreated prop
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('') // Add error state
  const { user } = useAuth() // Get user from AuthContext

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm()

  const selectedType = watch('type')

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true)
    setError('') // Clear previous errors
    try {
      if (!user || !user.token) {
        throw new Error('User not authenticated')
      }

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': selectedImage ? 'multipart/form-data' : 'application/json',
        },
      };

      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      formData.append('type', data.type);
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      await axios.post(`${API_BASE_URL}/posts`, formData, config);

      handleClose();
      onPostCreated(); // Call onPostCreated after successful post
    } catch (err) {
      console.error('Error creating post:', err.response?.data?.message || err.message)
      setError(err.response?.data?.message || 'Failed to create post') // Set error message
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setSelectedImage(null)
    setImagePreview(null)
    reset()
    onClose()
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Issue':
        return <AlertTriangle className="w-4 h-4" />
      case 'Announcement':
        return <Megaphone className="w-4 h-4" />
      case 'Progress':
        return <CheckCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const getTypeDescription = (type) => {
    switch (type) {
      case 'Issue':
        return 'Report a problem or concern that needs attention'
      case 'Announcement':
        return 'Share important information or updates with the community'
      case 'Progress':
        return 'Update on ongoing projects or completed initiatives'
      default:
        return 'Select a post type to get started'
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Post"
      size="lg"
    >
      <div className="max-h-[70vh] overflow-y-auto pr-2">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/10 border border-red-500/20 rounded-lg p-4"
          >
            <p className="text-red-400 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Post Type Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-200">
            Post Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[ 'Issue', 'Announcement', 'Progress' ].map((type) => (
              <label
                key={type}
                className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedType === type
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <input
                  type="radio"
                  value={type}
                  {...register('type', { required: 'Please select a post type' })}
                  className="sr-only"
                />
                <div className="flex items-center space-x-3">
                  {getTypeIcon(type)}
                  <span className="font-medium text-gray-100">{type}</span>
                </div>
              </label>
            ))}
          </div>
          {errors.type && (
            <p className="text-sm text-red-400">{errors.type.message}</p>
          )}
          {selectedType && (
            <p className="text-sm text-gray-400">{getTypeDescription(selectedType)}</p>
          )}
        </div>

        {/* Title */}
        <Input
          label="Title"
          placeholder="Enter a descriptive title"
          error={errors.title?.message}
          {...register('title', {
            required: 'Title is required',
            minLength: {
              value: 5,
              message: 'Title must be at least 5 characters'
            }
          })}
        />

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">
            Description
          </label>
          <textarea
            placeholder="Describe your post in detail..."
            rows={4}
            className="w-full bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            {...register('content', {
              required: 'Description is required',
              minLength: {
                value: 20,
                message: 'Description must be at least 20 characters'
              }
            })}
          />
          {errors.content && (
            <p className="text-sm text-red-400">{errors.content.message}</p>
          )}
        </div>

        {/* Image Upload */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-200">
            Image (Optional)
          </label>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors">
            {imagePreview ? (
              <div className="space-y-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-48 mx-auto rounded-lg"
                />
                <div className="flex items-center justify-center space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedImage(null)
                      setImagePreview(null)
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-gray-300 font-medium">Upload an image</p>
                  <p className="text-gray-400 text-sm">PNG, JPG up to 5MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  Choose File
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Create Post
          </Button>
        </div>
      </form>
      </div>
    </Modal>
  )
}

export default CreatePost

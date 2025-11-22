import express from 'express';
import { 
  createEventController,
  getEventsController,
  getEventController,
  updateEventController,
  deleteEventController,
  cancelEventController,
  publishEventController,
  getMyEventsController
} from '../controller/eventController';
import { authMiddleware } from '../middlewares/authMiddleware';
import upload  from '../services/multer'; // Import your multer config
import { COVER_IMAGES } from '../validator/uploadFields';

export const eventRoute = express.Router();

// Public routes (no auth required, but can use optional auth for personalization)
eventRoute.get('/', authMiddleware, getEventsController);
eventRoute.get('/:id', authMiddleware ,getEventController);

// Protected routes (auth required)
// Multiple file upload for cover images (max 5 images)
eventRoute.post('/', 
  authMiddleware, 
  upload.array('coverImages', 5), // Field name 'coverImages', max 5 files
  createEventController
);

eventRoute.get('/my/events', authMiddleware, getMyEventsController);

eventRoute.put('/:id', 
  authMiddleware, 
  upload.fields(COVER_IMAGES), 
  updateEventController
);

eventRoute.delete('/:id', authMiddleware, deleteEventController);
eventRoute.post('/:id/cancel', authMiddleware, cancelEventController);
eventRoute.post('/:id/publish', authMiddleware, publishEventController);
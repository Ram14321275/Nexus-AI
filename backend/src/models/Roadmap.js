import mongoose from 'mongoose';

const roadmapSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic: { type: String, required: true },
  nodes: [
    {
      title: { type: String, required: true },
      desc: { type: String, required: true },
    }
  ],
}, { timestamps: true });

export default mongoose.model('Roadmap', roadmapSchema);

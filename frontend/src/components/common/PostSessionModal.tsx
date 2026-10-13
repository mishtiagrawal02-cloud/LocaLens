import React, { useState } from 'react';
import { X, Star, Heart, DollarSign, CheckCircle2, Sparkles } from 'lucide-react';
import type { SessionReview } from '../../types';

interface PostSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: SessionReview) => void;
  guideName: string;
  guideAvatar?: string;
  sessionDuration: string;
  totalCost: number;
}

const feedbackTags = [
  { id: 'local-insider', label: 'Local Insider', icon: '🗺️' },
  { id: 'accessibility-pro', label: 'Accessibility Pro', icon: '♿' },
  { id: 'great-pace', label: 'Great Pace', icon: '⚡' },
  { id: 'clear-audio', label: 'Clear Audio', icon: '🎧' },
  { id: 'patient-helpful', label: 'Patient & Helpful', icon: '💚' },
  { id: 'hidden-gems', label: 'Hidden Gems', icon: '💎' },
  { id: 'cultural-insights', label: 'Cultural Insights', icon: '🎭' },
  { id: 'safety-conscious', label: 'Safety Conscious', icon: '🛡️' },
];

const tipAmounts = [
  { value: 2, label: '$2' },
  { value: 5, label: '$5' },
  { value: 10, label: '$10' },
  { value: 0, label: 'Custom' },
];

export const PostSessionModal: React.FC<PostSessionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  guideName,
  guideAvatar,
  sessionDuration,
  totalCost,
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [customTipAmount, setCustomTipAmount] = useState('');
  const [saveToFavorites, setSaveToFavorites] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleTipSelect = (amount: number) => {
    setSelectedTip(amount);
    if (amount !== 0) {
      setCustomTipAmount('');
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setIsSubmitting(true);

    const tipAmount = selectedTip === 0 ? parseFloat(customTipAmount || '0') : (selectedTip || 0);

    const review: SessionReview = {
      rating,
      feedbackTags: selectedTags,
      comment: comment.trim() || undefined,
      tipAmount,
      saveToFavorites,
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    onSubmit(review);
    setIsSubmitting(false);
    setIsSubmitted(true);

    // Close after showing success
    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setRating(0);
    setSelectedTags([]);
    setComment('');
    setSelectedTip(null);
    setCustomTipAmount('');
    setSaveToFavorites(false);
    setIsSubmitted(false);
    onClose();
  };

  const displayRating = hoveredRating || rating;
  const finalTipAmount = selectedTip === 0 ? parseFloat(customTipAmount || '0') : (selectedTip || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[2rem] border border-slate-200 bg-white shadow-2xl">
        {isSubmitted ? (
          <div className="p-8 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <h3 className="mt-4 text-2xl font-extrabold text-slate-950">
              Thank You! 🎉
            </h3>
            <p className="mt-2 text-sm font-semibold text-slate-600">
              Your review helps {guideName} shine
            </p>
            {finalTipAmount > 0 && (
              <p className="mt-2 text-sm font-bold text-emerald-700">
                ${finalTipAmount.toFixed(2)} tip will be sent to {guideName}
              </p>
            )}
          </div>
        ) : (
          <>
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg">
                {guideAvatar ? (
                  <img src={guideAvatar} alt={guideName} className="h-full w-full rounded-2xl object-cover" />
                ) : (
                  <span className="text-xl font-extrabold">
                    {guideName.split(' ').map(n => n[0]).join('')}
                  </span>
                )}
              </div>
              <h3 className="mt-4 text-2xl font-extrabold text-slate-950">
                Rate Your Session
              </h3>
              <p className="mt-1 text-sm font-semibold text-slate-600">
                with {guideName}
              </p>
              <div className="mt-3 flex items-center justify-center gap-3 text-xs font-semibold text-slate-500">
                <span>{sessionDuration}</span>
                <span>•</span>
                <span>${totalCost.toFixed(2)} session</span>
              </div>
            </div>

            <div className="space-y-6 p-6">
              {/* Star Rating */}
              <div>
                <label className="mb-3 block text-center text-xs font-bold uppercase tracking-wider text-slate-400">
                  Overall Experience
                </label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition hover:scale-110"
                    >
                      <Star
                        className={`h-10 w-10 ${
                          star <= displayRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="mt-2 text-center text-sm font-bold text-slate-700">
                    {rating === 5 && '⭐ Outstanding!'}
                    {rating === 4 && '😊 Great Experience'}
                    {rating === 3 && '👍 Good'}
                    {rating === 2 && '😐 Okay'}
                    {rating === 1 && '😔 Needs Improvement'}
                  </p>
                )}
              </div>

              {/* Feedback Tags */}
              <div>
                <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-slate-400">
                  What stood out? (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {feedbackTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        onClick={() => handleTagToggle(tag.id)}
                        className={`rounded-xl border-2 px-3 py-2 text-xs font-bold transition ${
                          isSelected
                            ? 'border-emerald-400 bg-emerald-100 text-emerald-700'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50'
                        }`}
                      >
                        <span className="mr-1">{tag.icon}</span>
                        {tag.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Additional Feedback (Optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience or suggestions..."
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              {/* Tip Jar */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Add a Tip (Optional)
                  </label>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {tipAmounts.map((tip) => (
                    <button
                      key={tip.value}
                      onClick={() => handleTipSelect(tip.value)}
                      className={`rounded-xl border-2 py-3 text-sm font-extrabold transition ${
                        selectedTip === tip.value
                          ? 'border-emerald-400 bg-emerald-100 text-emerald-700'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50'
                      }`}
                    >
                      {tip.label}
                    </button>
                  ))}
                </div>
                {selectedTip === 0 && (
                  <div className="mt-2">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-600">
                        $
                      </span>
                      <input
                        type="number"
                        value={customTipAmount}
                        onChange={(e) => setCustomTipAmount(e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-8 pr-4 text-sm font-bold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Save to Favorites */}
              <button
                onClick={() => setSaveToFavorites(!saveToFavorites)}
                className={`flex w-full items-center justify-between rounded-xl border-2 p-4 transition ${
                  saveToFavorites
                    ? 'border-pink-400 bg-pink-50'
                    : 'border-slate-200 bg-white hover:border-pink-200 hover:bg-pink-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Heart
                    className={`h-5 w-5 ${
                      saveToFavorites ? 'fill-pink-500 text-pink-500' : 'text-slate-400'
                    }`}
                  />
                  <div className="text-left">
                    <p className="text-sm font-extrabold text-slate-950">
                      Save {guideName} to Favorites
                    </p>
                    <p className="text-xs font-semibold text-slate-600">
                      Quick access for future sessions
                    </p>
                  </div>
                </div>
                {saveToFavorites && (
                  <Sparkles className="h-5 w-5 text-pink-500" />
                )}
              </button>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={rating === 0 || isSubmitting}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-extrabold text-white transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    Submit Review
                    {finalTipAmount > 0 && ` + $${finalTipAmount.toFixed(2)} Tip`}
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

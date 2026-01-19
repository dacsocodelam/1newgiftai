"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface GiftQuizProps {
  onComplete: (data: QuizData) => void;
  isLoading?: boolean;
}

export interface QuizData {
  age: string;
  gender: string;
  relationship: string;
  hobby: string;
  budget: string;
  occasion: string;
  styleImage?: File;
}

const GiftQuiz: React.FC<GiftQuizProps> = ({
  onComplete,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [quizData, setQuizData] = useState<QuizData>({
    age: "",
    gender: "女性",
    relationship: "",
    hobby: "",
    budget: "",
    occasion: "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");

  const steps = [
    {
      id: "relationship",
      question: t("quiz.steps.relationship.question"),
      subtitle: t("quiz.steps.relationship.subtitle"),
      type: "text",
      placeholder: t("quiz.steps.relationship.placeholder"),
      icon: "💕",
      bgGradient: "from-pink-50 to-rose-50",
    },
    {
      id: "age",
      question: t("quiz.steps.age.question"),
      subtitle: t("quiz.steps.age.subtitle"),
      type: "number",
      placeholder: t("quiz.steps.age.placeholder"),
      icon: "👤",
      bgGradient: "from-blue-50 to-cyan-50",
    },
    {
      id: "gender",
      question: t("quiz.steps.gender.question"),
      subtitle: t("quiz.steps.gender.subtitle"),
      type: "select",
      options: [
        {
          value: "女性",
          label: t("quiz.steps.gender.options.female"),
          icon: "🌸",
        },
        {
          value: "男性",
          label: t("quiz.steps.gender.options.male"),
          icon: "⚡",
        },
      ],
      icon: "⚧",
      bgGradient: "from-purple-50 to-indigo-50",
    },
    {
      id: "hobby",
      question: t("quiz.steps.hobby.question"),
      subtitle: t("quiz.steps.hobby.subtitle"),
      type: "text",
      placeholder: t("quiz.steps.hobby.placeholder"),
      icon: "✨",
      bgGradient: "from-yellow-50 to-amber-50",
    },
    {
      id: "occasion",
      question: t("quiz.steps.occasion.question"),
      subtitle: t("quiz.steps.occasion.subtitle"),
      type: "text",
      placeholder: t("quiz.steps.occasion.placeholder"),
      icon: "🎊",
      bgGradient: "from-green-50 to-emerald-50",
    },
    {
      id: "budget",
      question: t("quiz.steps.budget.question"),
      subtitle: t("quiz.steps.budget.subtitle"),
      type: "number",
      placeholder: t("quiz.steps.budget.placeholder"),
      icon: "💎",
      bgGradient: "from-orange-50 to-red-50",
    },
    {
      id: "styleImage",
      question: t("quiz.steps.styleImage.question"),
      subtitle: t("quiz.steps.styleImage.subtitle"),
      type: "image",
      icon: "🖼️",
      bgGradient: "from-teal-50 to-cyan-50",
    },
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(quizData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (value: string) => {
    setQuizData({ ...quizData, [currentStepData.id]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setQuizData({ ...quizData, styleImage: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const isStepValid = () => {
    const value = quizData[currentStepData.id as keyof QuizData];
    // Image step is optional
    if (currentStepData.id === "styleImage") return true;
    return value !== "" && value !== undefined;
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[#001f3f]">
            {t("quiz.progress.step")} {currentStep + 1} / {steps.length}
          </span>
          <span className="text-sm font-medium text-[#FFD700]">
            {Math.round(progress)}% {t("quiz.progress.complete")}
          </span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] transition-all duration-500 ease-out animate-glow"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Quiz Card */}
      <div
        className={`bg-gradient-to-br ${currentStepData.bgGradient} rounded-3xl shadow-2xl p-8 min-h-[400px] flex flex-col justify-between animate-flip-3d border-2 border-[#FFD700]/20`}
      >
        {/* Question Section */}
        <div>
          <div className="flex items-center justify-center mb-6">
            <div className="text-6xl animate-float-up-down">
              {currentStepData.icon}
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-[#001f3f] text-center mb-3 animate-text-reveal">
            {currentStepData.question}
          </h2>
          <p className="text-center text-gray-600 mb-8 animate-fade-in">
            {currentStepData.subtitle}
          </p>

          {/* Input Section */}
          <div className="mb-6">
            {currentStepData.type === "text" && (
              <input
                type="text"
                value={quizData[currentStepData.id as keyof QuizData] as string}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={currentStepData.placeholder}
                disabled={isLoading}
                className="w-full p-4 border-2 border-[#FFD700]/30 rounded-2xl focus:outline-none focus:border-[#FFD700] focus:ring-4 focus:ring-[#FFD700]/20 transition-all text-lg bg-white/80 backdrop-blur-sm"
                autoFocus
              />
            )}

            {currentStepData.type === "number" && (
              <input
                type="number"
                value={quizData[currentStepData.id as keyof QuizData] as string}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={currentStepData.placeholder}
                disabled={isLoading}
                className="w-full p-4 border-2 border-[#FFD700]/30 rounded-2xl focus:outline-none focus:border-[#FFD700] focus:ring-4 focus:ring-[#FFD700]/20 transition-all text-lg bg-white/80 backdrop-blur-sm"
                autoFocus
              />
            )}

            {currentStepData.type === "select" && currentStepData.options && (
              <div className="grid grid-cols-2 gap-4">
                {currentStepData.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleInputChange(option.value)}
                    disabled={isLoading}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                      quizData[currentStepData.id as keyof QuizData] ===
                      option.value
                        ? "border-[#FFD700] bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white shadow-lg scale-105"
                        : "border-gray-300 bg-white/80 hover:border-[#FFD700] hover:scale-105"
                    }`}
                  >
                    <div className="text-4xl mb-2">{option.icon}</div>
                    <div className="font-bold">{option.label}</div>
                  </button>
                ))}
              </div>
            )}

            {currentStepData.type === "image" && (
              <div className="space-y-4">
                <label className="block">
                  <div className="border-2 border-dashed border-[#FFD700]/50 rounded-2xl p-8 text-center cursor-pointer hover:border-[#FFD700] hover:bg-white/50 transition-all bg-white/80 backdrop-blur-sm">
                    {imagePreview ? (
                      <div className="space-y-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-48 mx-auto rounded-xl shadow-lg"
                        />
                        <p className="text-sm text-gray-600">
                          {t("quiz.steps.styleImage.changeImage")}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div className="text-5xl mb-4">📷</div>
                        <p className="text-lg font-medium text-[#001f3f] mb-2">
                          {t("quiz.steps.styleImage.uploadImage")}
                        </p>
                        <p className="text-sm text-gray-500">
                          {t("quiz.steps.styleImage.dragDrop")}
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isLoading}
                    />
                  </div>
                </label>
                <p className="text-xs text-gray-500 text-center">
                  ⚡ AIが画像を分析して、より適切なギフトを提案します
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0 || isLoading}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
              currentStep === 0 || isLoading
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white border-2 border-[#FFD700] text-[#001f3f] hover:bg-[#FFD700]/10 hover:scale-105"
            }`}
          >
            {t("quiz.buttons.back")}
          </button>

          <button
            onClick={handleNext}
            disabled={!isStepValid() || isLoading}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all duration-300 relative overflow-hidden group ${
              !isStepValid() || isLoading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#001f3f] hover:scale-105 hover:shadow-xl"
            }`}
          >
            {!isStepValid() || isLoading ? null : (
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            )}
            <span className="relative z-10">
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#001f3f]"></div>
                  {t("quiz.buttons.processing")}
                </div>
              ) : currentStep === steps.length - 1 ? (
                t("quiz.buttons.complete")
              ) : (
                t("quiz.buttons.next")
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentStep
                ? "w-8 bg-gradient-to-r from-[#FFD700] to-[#FFA500]"
                : index < currentStep
                  ? "w-2 bg-[#FFD700]"
                  : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default GiftQuiz;

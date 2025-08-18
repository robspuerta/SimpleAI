import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useEventLogger } from "@/hooks/use-event-logger";
import { ImageUpload } from "@/components/ImageUpload";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { Loader2, Image, Video, Zap, Clock, Timer, Wand2, Upload, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useState as useCarouselState } from "react";

// Import example images
import example1 from "../assets/image-example001_1755388920690.jpg";
import example2 from "../assets/image-example002_1755388920690.jpg";
import example3 from "../assets/image-example003_1755388920689.jpg";
import example4 from "../assets/image-example004_1755388920689.jpg";
import example5 from "../assets/image-example005_1755388920689.jpg";
import example6 from "../assets/image-example006_1755388920688.jpg";

const formSchema = z.object({
  taskType: z.enum(["image", "video"]),
  speed: z.enum(["slow", "normal", "fast"]).optional(),
  prompt: z.string().min(50, "Prompt must be at least 50 characters"),
  aspectRatio: z.string().optional(),
  uploadedImage: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const examples = {
  product: "A professional product photo of a smartphone on a clean white background, studio lighting",
  restaurant: "A modern restaurant interior with warm lighting, wooden tables, and plants, cozy atmosphere",
  customer: "A happy customer smiling while using a laptop in a coffee shop, natural lighting, lifestyle photography",
};

const aspectRatios = [
  { value: "16:9", label: "16:9 - Widescreen (Landscape)" },
  { value: "1:1", label: "1:1 - Square (Social Media)" },
  { value: "9:16", label: "9:16 - Portrait (Mobile)" },
  { value: "4:3", label: "4:3 - Standard (Traditional)" },
  { value: "3:2", label: "3:2 - Photography" },
  { value: "2:3", label: "2:3 - Portrait Photography" },
  { value: "3:4", label: "3:4 - Portrait Standard" },
  { value: "5:6", label: "5:6 - Social Portrait" },
  { value: "6:5", label: "6:5 - Social Landscape" },
  { value: "2:1", label: "2:1 - Ultra-wide" },
  { value: "1:2", label: "1:2 - Ultra-tall" },
];

// Example before/after pairs for carousel
const beforeAfterExamples = [
  { 
    id: 1, 
    before: example1, 
    after: example2,
    beforeAlt: "Original portrait photo",
    afterAlt: "Ghibli-style artwork"
  },
  { 
    id: 2, 
    before: example3, 
    after: example4,
    beforeAlt: "Street photography",
    afterAlt: "Animated scene"
  },
  { 
    id: 3, 
    before: example5, 
    after: example6,
    beforeAlt: "Landscape photo",
    afterAlt: "Fantasy artwork"
  }
];

export default function Home() {
  const [generationResult, setGenerationResult] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useCarouselState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { toast } = useToast();
  const { logEvent } = useEventLogger();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskType: "image",
      speed: "slow",
      prompt: "",
      aspectRatio: "16:9",
    },
  });

  const { watch, setValue, reset } = form;
  const watchedValues = watch();
  const promptLength = watchedValues.prompt?.length || 0;
  const isFormValid = promptLength >= 50;

  const generateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/generate", data);
      return response.json();
    },
    onSuccess: async (data) => {
      logEvent("generation_started", "generate-form", {
        requestId: data.id,
        ...watchedValues,
        promptLength,
      });
      
      // Poll for completion
      const pollResult = async () => {
        try {
          const response = await apiRequest("GET", `/api/generate/${data.id}`);
          const result = await response.json();
          
          if (result.status === "completed") {
            const mockResponse = await apiRequest("GET", `/api/mock-result/${data.id}`);
            const mockResult = await mockResponse.json();
            setGenerationResult(mockResult);
            setIsGenerating(false);
            logEvent("generation_completed", "generation-process", {
              requestId: data.id,
              success: true,
            });
          } else {
            setTimeout(pollResult, 1000);
          }
        } catch (error) {
          setIsGenerating(false);
          logEvent("generation_error", "generation-process", {
            requestId: data.id,
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      };
      
      setIsGenerating(true);
      setTimeout(pollResult, 1000);
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const handleReset = () => {
    reset();
    setGenerationResult(null);
    setIsGenerating(false);
    logEvent("form_reset", "reset-button");
  };

  const handleExampleClick = (exampleKey: keyof typeof examples) => {
    const exampleText = examples[exampleKey];
    setValue("prompt", exampleText);
    logEvent("example_selected", "example-button", {
      exampleType: exampleKey,
      text: exampleText,
    });
  };

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % beforeAfterExamples.length);
      logEvent("carousel_auto_advance", "carousel-auto", { currentIndex: currentImageIndex });
    }, 2500); // 2.5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, currentImageIndex, logEvent]);

  // Carousel navigation functions
  const nextImage = () => {
    setIsAutoPlaying(false); // Pause auto-play when user manually navigates
    setCurrentImageIndex((prev) => (prev + 1) % beforeAfterExamples.length);
    logEvent("carousel_next", "carousel-navigation", { currentIndex: currentImageIndex });
    
    // Resume auto-play after 5 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const prevImage = () => {
    setIsAutoPlaying(false); // Pause auto-play when user manually navigates
    setCurrentImageIndex((prev) => (prev - 1 + beforeAfterExamples.length) % beforeAfterExamples.length);
    logEvent("carousel_prev", "carousel-navigation", { currentIndex: currentImageIndex });
    
    // Resume auto-play after 5 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false); // Pause auto-play when user manually navigates
    setCurrentImageIndex(index);
    logEvent("carousel_dot_click", "carousel-navigation", { targetIndex: index });
    
    // Resume auto-play after 5 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const onSubmit = (data: FormData) => {
    if (!isFormValid) return;
    generateMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SimpleAI</h1>
              <p className="text-sm text-gray-600">Create quality Images and Videos fast and simple.</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Panel - Controls */}
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  
                  {/* Task Type */}
                  <FormField
                    control={form.control}
                    name="taskType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                          <Wand2 className="h-4 w-4 text-primary mr-2" />
                          Task Type <span className="text-red-500 ml-1">*</span>
                        </FormLabel>
                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            type="button"
                            variant={field.value === "image" ? "default" : "outline"}
                            className={`flex items-center justify-center py-2 h-auto ${
                              field.value === "image" ? "" : "border-gray-400 hover:border-gray-500"
                            }`}
                            onClick={() => {
                              field.onChange("image");
                              logEvent("task_type_selected", "task-type-button", { taskType: "image" });
                            }}
                          >
                            <Image className="h-4 w-4 mr-2" />
                            Image
                          </Button>
                          <Button
                            type="button"
                            variant={field.value === "video" ? "default" : "outline"}
                            className={`flex items-center justify-center py-2 h-auto ${
                              field.value === "video" ? "" : "border-gray-400 hover:border-gray-500"
                            }`}
                            onClick={() => {
                              field.onChange("video");
                              logEvent("task_type_selected", "task-type-button", { taskType: "video" });
                            }}
                          >
                            <Video className="h-4 w-4 mr-2" />
                            Video
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500">Select the output format.</p>
                      </FormItem>
                    )}
                  />

                  {/* Image-specific options */}
                  {watchedValues.taskType === "image" && (
                    <>
                      {/* Speed Selection */}
                      <FormField
                        control={form.control}
                        name="speed"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between mb-2">
                              <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                                <Settings className="h-4 w-4 text-primary mr-2" />
                                Speed
                              </FormLabel>
                              <span className="text-xs text-gray-500">Fast: 1min, Normal: 1-2min, Slow: +3min</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { value: "slow", label: "Slow", icon: Clock },
                                { value: "normal", label: "Normal", icon: Timer },
                                { value: "fast", label: "Fast", icon: Zap },
                              ].map(({ value, label, icon: Icon }) => (
                                <Button
                                  key={value}
                                  type="button"
                                  size="sm"
                                  variant={field.value === value ? "default" : "outline"}
                                  className={field.value === value ? "" : "border-gray-400 hover:border-gray-500"}
                                  onClick={() => {
                                    field.onChange(value);
                                    logEvent("speed_selected", "speed-button", { speed: value });
                                  }}
                                >
                                  <Icon className="h-3 w-3 mr-1" />
                                  {label}
                                </Button>
                              ))}
                            </div>
                          </FormItem>
                        )}
                      />

                      {/* Prompt Input with Quick Examples */}
                      <FormField
                        control={form.control}
                        name="prompt"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between mb-2">
                              <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                                <Wand2 className="h-4 w-4 text-primary mr-2" />
                                Prompt <span className="text-red-500 ml-1">*</span>
                              </FormLabel>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-600 flex-shrink-0">Quick Examples</span>
                                <div className="flex gap-1">
                                  {Object.entries(examples).map(([key, text]) => (
                                    <Button
                                      key={key}
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      className="h-5 px-1.5 py-0 text-xs border-gray-400 hover:border-gray-500"
                                      onClick={() => handleExampleClick(key as keyof typeof examples)}
                                    >
                                      {key === "product" && "Product Photo"}
                                      {key === "restaurant" && "Restaurant"}
                                      {key === "customer" && "Customer"}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <FormControl>
                              <Textarea
                                {...field}
                                rows={4}
                                placeholder="A professional product photo of a smartphone on a clean white background, studio lighting"
                                className="resize-none border-gray-400 focus:border-gray-600 focus:ring-gray-600"
                                onChange={(e) => {
                                  field.onChange(e);
                                  logEvent("prompt_input", "prompt-field", {
                                    length: e.target.value.length,
                                    isValid: e.target.value.length >= 50,
                                  });
                                }}
                              />
                            </FormControl>
                            <div className="flex justify-between items-center">
                              <span className={`text-xs ${promptLength < 50 ? 'text-red-500' : 'text-gray-500'}`}>
                                {promptLength}/50
                              </span>
                              {promptLength < 50 && (
                                <span className="text-xs text-red-500">Minimum 50 characters required</span>
                              )}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Image Upload */}
                      <div>
                        <FormLabel className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          <Upload className="h-4 w-4 text-primary mr-2" />
                          Upload Image (optional)
                        </FormLabel>
                        <ImageUpload
                          onUpload={(imageUrl) => {
                            setValue("uploadedImage", imageUrl);
                            logEvent("image_uploaded", "image-upload", { imageUrl });
                          }}
                          onRemove={() => {
                            setValue("uploadedImage", "");
                            logEvent("image_removed", "image-upload");
                          }}
                        />
                      </div>

                      {/* Aspect Ratio */}
                      <FormField
                        control={form.control}
                        name="aspectRatio"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <FormLabel className="flex items-center text-sm font-medium text-gray-700 flex-shrink-0">
                                <Settings className="h-4 w-4 text-primary mr-2" />
                                Aspect Ratio
                              </FormLabel>
                              <div className="w-60">
                                <Select
                                  value={field.value}
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    logEvent("aspect_ratio_selected", "aspect-ratio-select", { aspectRatio: value });
                                  }}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {aspectRatios.map((ratio) => (
                                      <SelectItem key={ratio.value} value={ratio.value}>
                                        {ratio.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {/* Video options placeholder */}
                  {watchedValues.taskType === "video" && (
                    <div className="text-center py-8 text-gray-500">
                      <Video className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">Video Generation</p>
                      <p className="text-sm">Coming Soon</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-4 border-t border-gray-200">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={handleReset}
                    >
                      Reset
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={!isFormValid || generateMutation.isPending || isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "Generate"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Right Panel - Before/After Carousel */}
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6 h-full min-h-96">
              <div className="flex flex-col items-center justify-center h-full space-y-6">
                {/* Carousel Container */}
                <div 
                  className="relative w-full max-w-md"
                  onMouseEnter={() => setIsAutoPlaying(false)}
                  onMouseLeave={() => setIsAutoPlaying(true)}
                >
                  <div className="flex items-center justify-between">
                    {/* Previous Button */}
                    <button 
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 shadow-md hover:bg-gray-200 transition-colors z-10"
                      onClick={prevImage}
                      aria-label="Previous comparison"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    
                    {/* Before/After Slider */}
                    <div className="flex-1 mx-4">
                      <BeforeAfterSlider
                        beforeImage={beforeAfterExamples[currentImageIndex].before}
                        afterImage={beforeAfterExamples[currentImageIndex].after}
                        beforeAlt={beforeAfterExamples[currentImageIndex].beforeAlt}
                        afterAlt={beforeAfterExamples[currentImageIndex].afterAlt}
                      />
                    </div>
                    
                    {/* Next Button */}
                    <button 
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 shadow-md hover:bg-gray-200 transition-colors z-10"
                      onClick={nextImage}
                      aria-label="Next comparison"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                  
                  {/* Dots Indicator */}
                  <div className="flex justify-center items-center space-x-2 mt-4">
                    {beforeAfterExamples.map((_: any, index: number) => (
                      <button
                        key={index}
                        className={`h-2 w-2 rounded-full transition-all duration-200 ${
                          index === currentImageIndex 
                            ? 'bg-blue-600 w-6' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                    
                    {/* Auto-play indicator */}
                    <div className="ml-3 flex items-center text-xs text-gray-500">
                      <div className={`w-2 h-2 rounded-full mr-1 transition-colors ${isAutoPlaying ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      {isAutoPlaying ? 'Auto' : 'Paused'}
                    </div>
                  </div>
                </div>
                
                {/* Text Section */}
                <div className="text-center space-y-3">
                  <h3 className="text-xl font-bold text-gray-900">
                    Just Imagine It, We Can Create It.
                  </h3>
                  <p className="text-sm text-gray-600">
                    Upload a photo to transform it into a Ghibli masterpiece.
                  </p>
                </div>
                
                {/* Call-to-Action Button */}
                <Button
                  variant="outline"
                  className="w-full max-w-md border-blue-500 text-blue-600 hover:bg-blue-50 py-3 rounded-lg font-medium"
                  onClick={() => document.getElementById("image-upload-input")?.click()}
                >
                  Upload Your Image
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

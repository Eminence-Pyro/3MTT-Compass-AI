import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Mic, MicOff, Volume2, VolumeX, Languages, Subtitles, Eye, EyeOff, Settings } from 'lucide-react';
import { AccessibilityFeatures as AccessibilityFeaturesType } from '../../types/ai';
import { toast } from 'sonner';

interface AccessibilityFeaturesProps {
  onFeaturesChange?: (features: AccessibilityFeaturesType) => void;
}

const AccessibilityFeatures: React.FC<AccessibilityFeaturesProps> = ({ onFeaturesChange }) => {
  const [features, setFeatures] = useState<AccessibilityFeaturesType>({
    translation: {
      enabled: false,
      targetLanguage: 'en',
      confidence: 0
    },
    transcription: {
      enabled: false,
      language: 'en-US',
      accuracy: 0
    },
    voiceInteraction: {
      enabled: false,
      wakeWord: 'Hey Assistant'
    }
  });

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      setRecognition(recognitionInstance);
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      setSynthesis(window.speechSynthesis);
    }
  }, []);

  useEffect(() => {
    onFeaturesChange?.(features);
  }, [features, onFeaturesChange]);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'zh', name: 'Chinese' },
    { code: 'hi', name: 'Hindi' },
    { code: 'yo', name: 'Yoruba' },
    { code: 'ig', name: 'Igbo' },
    { code: 'ha', name: 'Hausa' }
  ];

  const speechLanguages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'es-ES', name: 'Spanish' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
    { code: 'pt-BR', name: 'Portuguese' },
    { code: 'ar-SA', name: 'Arabic' },
    { code: 'zh-CN', name: 'Chinese' },
    { code: 'hi-IN', name: 'Hindi' }
  ];

  const toggleTranslation = (enabled: boolean) => {
    setFeatures(prev => ({
      ...prev,
      translation: {
        ...prev.translation,
        enabled,
        confidence: enabled ? 0.85 : 0
      }
    }));

    if (enabled) {
      toast.success('Translation enabled');
    } else {
      toast.info('Translation disabled');
    }
  };

  const toggleTranscription = (enabled: boolean) => {
    setFeatures(prev => ({
      ...prev,
      transcription: {
        ...prev.transcription,
        enabled,
        accuracy: enabled ? 0.92 : 0
      }
    }));

    if (enabled) {
      toast.success('Live transcription enabled');
    } else {
      toast.info('Live transcription disabled');
    }
  };

  const toggleVoiceInteraction = (enabled: boolean) => {
    setFeatures(prev => ({
      ...prev,
      voiceInteraction: {
        ...prev.voiceInteraction,
        enabled
      }
    }));

    if (enabled) {
      toast.success('Voice interaction enabled');
    } else {
      toast.info('Voice interaction disabled');
      stopListening();
    }
  };

  const startListening = () => {
    if (!recognition || !features.voiceInteraction.enabled) return;

    setIsListening(true);
    recognition.lang = features.transcription.language;
    
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      
      console.log('Speech recognized:', transcript);
      
      // Check for wake word
      if (transcript.toLowerCase().includes(features.voiceInteraction.wakeWord.toLowerCase())) {
        toast.success('Voice command detected!');
        // Process voice command here
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      toast.error('Speech recognition error');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsListening(false);
  };

  const speakText = (text: string) => {
    if (!synthesis) return;

    if (isSpeaking) {
      synthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = features.transcription.language;
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      toast.error('Speech synthesis error');
    };

    synthesis.speak(utterance);
  };

  const translateText = async (text: string, targetLang: string) => {
    // Mock translation - in production, use Google Translate API or similar
    const translations: { [key: string]: string } = {
      'Hello': targetLang === 'es' ? 'Hola' : targetLang === 'fr' ? 'Bonjour' : 'Hello',
      'Welcome': targetLang === 'es' ? 'Bienvenido' : targetLang === 'fr' ? 'Bienvenue' : 'Welcome',
      'Learning': targetLang === 'es' ? 'Aprendizaje' : targetLang === 'fr' ? 'Apprentissage' : 'Learning'
    };

    return translations[text] || `[${targetLang.toUpperCase()}] ${text}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-600" />
            Accessibility Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Translation */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Languages className="h-4 w-4" />
                  Real-time Translation
                </Label>
                <p className="text-sm text-gray-600">
                  Translate content to your preferred language
                </p>
              </div>
              <Switch
                checked={features.translation.enabled}
                onCheckedChange={toggleTranslation}
              />
            </div>

            {features.translation.enabled && (
              <div className="ml-6 space-y-3">
                <div className="space-y-2">
                  <Label>Target Language</Label>
                  <Select
                    value={features.translation.targetLanguage}
                    onValueChange={(value) => setFeatures(prev => ({
                      ...prev,
                      translation: { ...prev.translation, targetLanguage: value }
                    }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Badge className="bg-green-100 text-green-700">
                  Confidence: {(features.translation.confidence * 100).toFixed(0)}%
                </Badge>
              </div>
            )}
          </div>

          {/* Transcription */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Subtitles className="h-4 w-4" />
                  Live Transcription
                </Label>
                <p className="text-sm text-gray-600">
                  Convert speech to text in real-time
                </p>
              </div>
              <Switch
                checked={features.transcription.enabled}
                onCheckedChange={toggleTranscription}
              />
            </div>

            {features.transcription.enabled && (
              <div className="ml-6 space-y-3">
                <div className="space-y-2">
                  <Label>Speech Language</Label>
                  <Select
                    value={features.transcription.language}
                    onValueChange={(value) => setFeatures(prev => ({
                      ...prev,
                      transcription: { ...prev.transcription, language: value }
                    }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {speechLanguages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Badge className="bg-blue-100 text-blue-700">
                  Accuracy: {(features.transcription.accuracy * 100).toFixed(0)}%
                </Badge>
              </div>
            )}
          </div>

          {/* Voice Interaction */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  Voice Interaction
                </Label>
                <p className="text-sm text-gray-600">
                  Control the app with voice commands
                </p>
              </div>
              <Switch
                checked={features.voiceInteraction.enabled}
                onCheckedChange={toggleVoiceInteraction}
              />
            </div>

            {features.voiceInteraction.enabled && (
              <div className="ml-6 space-y-3">
                <div className="flex gap-2">
                  <Button
                    variant={isListening ? "destructive" : "default"}
                    onClick={isListening ? stopListening : startListening}
                    className="flex items-center gap-2"
                  >
                    {isListening ? (
                      <>
                        <MicOff className="h-4 w-4" />
                        Stop Listening
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4" />
                        Start Listening
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => speakText('Welcome to 3MTT Compass AI. How can I help you today?')}
                    className="flex items-center gap-2"
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX className="h-4 w-4" />
                        Stop Speaking
                      </>
                    ) : (
                      <>
                        <Volume2 className="h-4 w-4" />
                        Test Speech
                      </>
                    )}
                  </Button>
                </div>

                {isListening && (
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-700">Listening for "{features.voiceInteraction.wakeWord}"...</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Demo Translation */}
      {features.translation.enabled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5 text-green-600" />
              Translation Demo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Original Text</Label>
                  <div className="p-3 bg-gray-50 rounded border">
                    Welcome to your learning journey with 3MTT Compass AI!
                  </div>
                </div>
                <div>
                  <Label>Translated Text</Label>
                  <div className="p-3 bg-blue-50 rounded border">
                    {features.translation.targetLanguage === 'es' && 
                      '¡Bienvenido a tu viaje de aprendizaje con 3MTT Compass AI!'
                    }
                    {features.translation.targetLanguage === 'fr' && 
                      'Bienvenue dans votre parcours d\'apprentissage avec 3MTT Compass AI!'
                    }
                    {features.translation.targetLanguage === 'yo' && 
                      'Kaabo si irin-ajo ikeko re pelu 3MTT Compass AI!'
                    }
                    {!['es', 'fr', 'yo'].includes(features.translation.targetLanguage) && 
                      'Welcome to your learning journey with 3MTT Compass AI!'
                    }
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feature Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-600" />
            Feature Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="text-sm font-medium">Translation</span>
              <Badge className={features.translation.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                {features.translation.enabled ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="text-sm font-medium">Transcription</span>
              <Badge className={features.transcription.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                {features.transcription.enabled ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="text-sm font-medium">Voice Control</span>
              <Badge className={features.voiceInteraction.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                {features.voiceInteraction.enabled ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessibilityFeatures;
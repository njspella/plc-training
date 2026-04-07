const Progress = (function () {
  const STORAGE_KEY = 'plc_training_progress';

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  function save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function setLessonComplete(moduleId, lessonId) {
    const data = load();
    if (!data.lessons) data.lessons = {};
    const key = `${moduleId}-${lessonId}`;
    data.lessons[key] = true;
    save(data);
  }

  function isLessonComplete(moduleId, lessonId) {
    const data = load();
    return !!(data.lessons && data.lessons[`${moduleId}-${lessonId}`]);
  }

  function setQuizScore(moduleId, score, total) {
    const data = load();
    if (!data.quizzes) data.quizzes = {};
    data.quizzes[moduleId] = { score, total, passed: (score / total) >= 0.8, date: new Date().toISOString() };
    save(data);
  }

  function getQuizResult(moduleId) {
    const data = load();
    return data.quizzes ? data.quizzes[moduleId] : null;
  }

  function setScenarioComplete(scenarioId) {
    const data = load();
    if (!data.scenarios) data.scenarios = {};
    data.scenarios[scenarioId] = { completed: true, date: new Date().toISOString() };
    save(data);
  }

  function isScenarioComplete(scenarioId) {
    const data = load();
    return !!(data.scenarios && data.scenarios[scenarioId] && data.scenarios[scenarioId].completed);
  }

  function getModuleProgress(moduleId) {
    const mod = TrainingData.modules.find(m => m.id === moduleId);
    if (!mod) return 0;
    const totalLessons = mod.lessons.length;
    if (totalLessons === 0) return 0;
    let completed = 0;
    for (const lesson of mod.lessons) {
      if (isLessonComplete(moduleId, lesson.id)) completed++;
    }
    return Math.round((completed / totalLessons) * 100);
  }

  function isModuleComplete(moduleId) {
    const mod = TrainingData.modules.find(m => m.id === moduleId);
    if (!mod) return false;
    for (const lesson of mod.lessons) {
      if (!isLessonComplete(moduleId, lesson.id)) return false;
    }
    const quiz = getQuizResult(moduleId);
    if (mod.quiz && mod.quiz.length > 0 && (!quiz || !quiz.passed)) return false;
    return true;
  }

  function getOverallProgress() {
    const modules = TrainingData.modules;
    if (modules.length === 0) return 0;
    let totalItems = 0;
    let completedItems = 0;
    for (const mod of modules) {
      for (const lesson of mod.lessons) {
        totalItems++;
        if (isLessonComplete(mod.id, lesson.id)) completedItems++;
      }
    }
    return totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);
  }

  function resetProgress() {
    localStorage.removeItem(STORAGE_KEY);
  }

  return {
    setLessonComplete,
    isLessonComplete,
    setQuizScore,
    getQuizResult,
    setScenarioComplete,
    isScenarioComplete,
    getModuleProgress,
    isModuleComplete,
    getOverallProgress,
    resetProgress
  };
})();

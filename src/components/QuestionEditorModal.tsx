import React, { useState, useRef } from 'react';
import type { Question, AnswerKey } from '../types';
import { useQuiz } from '../context/QuizContext';
import { PRESET_PACKS, exportQuestionsToJson } from '../lib/questionStore';

export default function QuestionEditorModal() {
  const { state, setQuestions, toggleEditor } = useQuiz();
  const { questions, activePackId, isQuestionEditorOpen } = state;

  const [mode, setMode] = useState<'visual' | 'rawJson'>('visual');
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [rawText, setRawText] = useState<string>('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Form state for visual editing
  const [editingQuestion, setEditingQuestion] = useState<Question>(() => {
    return questions[0] || {
      id: 1,
      category: 'General',
      difficulty: 'Beginner',
      question: '',
      options: { A: '', B: '', C: '', D: '' },
      correctAnswer: 'A',
      explanation: '',
    };
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isQuestionEditorOpen) return null;

  const handleSelectQuestion = (idx: number) => {
    setSelectedIdx(idx);
    setEditingQuestion({ ...questions[idx] });
  };

  const handleSaveCurrentVisual = () => {
    const updated = [...questions];
    if (selectedIdx >= 0 && selectedIdx < updated.length) {
      updated[selectedIdx] = { ...editingQuestion };
    } else {
      updated.push({ ...editingQuestion, id: Date.now() });
      setSelectedIdx(updated.length - 1);
    }
    setQuestions(updated, 'custom');
  };

  const handleAddNewQuestion = () => {
    const newQ: Question = {
      id: Date.now(),
      category: 'English Grammar',
      difficulty: 'Beginner',
      question: 'New question prompt...',
      options: { A: 'Option A', B: 'Option B', C: 'Option C', D: 'Option D' },
      correctAnswer: 'A',
      explanation: 'Explanation here...',
    };
    const updated = [...questions, newQ];
    setQuestions(updated, 'custom');
    setSelectedIdx(updated.length - 1);
    setEditingQuestion(newQ);
  };

  const handleDeleteQuestion = (idx: number) => {
    if (questions.length <= 1) {
      alert('You must have at least one question in the quiz!');
      return;
    }
    const updated = questions.filter((_, i) => i !== idx);
    const newIdx = Math.max(0, idx - 1);
    setQuestions(updated, 'custom');
    setSelectedIdx(newIdx);
    setEditingQuestion(updated[newIdx]);
  };

  const handleSwitchPack = (packId: string) => {
    const pack = PRESET_PACKS.find((p) => p.id === packId);
    if (pack) {
      const packQuestions = pack.getQuestions();
      setQuestions(packQuestions, packId);
      setSelectedIdx(0);
      setEditingQuestion(packQuestions[0]);
    }
  };

  const handleOpenRawJson = () => {
    setRawText(JSON.stringify(questions, null, 2));
    setJsonError(null);
    setMode('rawJson');
  };

  const handleSaveRawJson = () => {
    try {
      const parsed = JSON.parse(rawText);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        setJsonError('JSON must be a non-empty array of questions.');
        return;
      }
      for (const q of parsed) {
        if (!q.question || !q.options || !q.correctAnswer) {
          setJsonError('Each question must have "question", "options", and "correctAnswer".');
          return;
        }
      }
      setQuestions(parsed, 'custom');
      setSelectedIdx(0);
      setEditingQuestion(parsed[0]);
      setJsonError(null);
      setMode('visual');
    } catch (e: any) {
      setJsonError('Invalid JSON format: ' + e.message);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setQuestions(parsed, 'custom');
          setSelectedIdx(0);
          setEditingQuestion(parsed[0]);
          alert(`Successfully loaded ${parsed.length} questions!`);
        }
      } catch (err: any) {
        alert('Failed to parse uploaded JSON file: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="ar-modal-backdrop" onClick={() => toggleEditor(false)}>
      <div className="ar-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="ar-modal-header">
          <div className="modal-title-group">
            <h2 className="modal-title">⚙️ Question & Pack Manager</h2>
            <p className="modal-subtitle">Add, edit, or import lightweight JSON questions for your AR Quiz</p>
          </div>
          <button className="ar-modal-close-btn" onClick={() => toggleEditor(false)} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Toolbar: Switch pack, Raw JSON, Import/Export */}
        <div className="ar-modal-toolbar">
          <div className="toolbar-left">
            <span className="toolbar-label">Active Pack:</span>
            <select
              className="pack-select"
              value={activePackId}
              onChange={(e) => handleSwitchPack(e.target.value)}
            >
              {PRESET_PACKS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
              {activePackId === 'custom' && <option value="custom">✏️ Custom Pack ({questions.length} Qs)</option>}
            </select>
          </div>

          <div className="toolbar-right">
            <button
              className={`btn btn-sm ${mode === 'visual' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setMode('visual')}
            >
              Visual Editor
            </button>
            <button
              className={`btn btn-sm ${mode === 'rawJson' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={handleOpenRawJson}
            >
              Raw JSON
            </button>
            <button
              className="btn btn-sm btn-outline"
              onClick={() => exportQuestionsToJson(questions)}
            >
              📥 Export JSON
            </button>
            <button
              className="btn btn-sm btn-outline"
              onClick={() => fileInputRef.current?.click()}
            >
              📤 Import JSON
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
          </div>
        </div>

        {/* Modal Body */}
        {mode === 'visual' ? (
          <div className="ar-modal-body-visual">
            {/* Left list of questions */}
            <div className="questions-sidebar-list">
              <div className="sidebar-list-header">
                <span>Questions ({questions.length})</span>
                <button className="btn btn-xs btn-primary" onClick={handleAddNewQuestion}>
                  + Add
                </button>
              </div>
              <div className="sidebar-list-items">
                {questions.map((q, i) => (
                  <div
                    key={q.id || i}
                    className={`sidebar-q-item ${i === selectedIdx ? 'selected' : ''}`}
                    onClick={() => handleSelectQuestion(i)}
                  >
                    <span className="q-item-num">Q{i + 1}</span>
                    <span className="q-item-preview">{q.question || '(Empty question)'}</span>
                    <button
                      className="q-item-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteQuestion(i);
                      }}
                      title="Delete question"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right form to edit selected question */}
            <div className="question-edit-form">
              <div className="form-row-compact">
                <div className="form-group flex-1">
                  <label>Category</label>
                  <input
                    type="text"
                    value={editingQuestion.category || ''}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, category: e.target.value })}
                    placeholder="e.g. English Grammar"
                  />
                </div>
                <div className="form-group width-120">
                  <label>Difficulty</label>
                  <select
                    value={editingQuestion.difficulty || 'Beginner'}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, difficulty: e.target.value })}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Question Text (use ________ for blanks)</label>
                <textarea
                  rows={3}
                  value={editingQuestion.question}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, question: e.target.value })}
                  placeholder="You should ___________ some vitamins and get some rest."
                />
              </div>

              <div className="options-grid-inputs">
                {(['A', 'B', 'C', 'D'] as AnswerKey[]).map((key) => (
                  <div key={key} className={`option-input-group ${editingQuestion.correctAnswer === key ? 'is-correct' : ''}`}>
                    <div className="option-input-header">
                      <span className="badge-letter">{key}</span>
                      <label className="correct-radio-label">
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={editingQuestion.correctAnswer === key}
                          onChange={() => setEditingQuestion({ ...editingQuestion, correctAnswer: key })}
                        />
                        Correct
                      </label>
                    </div>
                    <input
                      type="text"
                      value={editingQuestion.options[key] || ''}
                      onChange={(e) =>
                        setEditingQuestion({
                          ...editingQuestion,
                          options: { ...editingQuestion.options, [key]: e.target.value },
                        })
                      }
                      placeholder={`Option ${key}`}
                    />
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label>Explanation (shown after answer)</label>
                <input
                  type="text"
                  value={editingQuestion.explanation || ''}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
                  placeholder="Why is this answer correct?"
                />
              </div>

              <div className="form-actions-bottom">
                <button className="btn btn-primary" onClick={handleSaveCurrentVisual}>
                  💾 Save Changes
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="ar-modal-body-json">
            <p className="json-instructions">
              Edit raw JSON directly or paste your own question list. Must be an array of objects matching the schema.
            </p>
            {jsonError && <div className="json-error-banner">{jsonError}</div>}
            <textarea
              className="raw-json-textarea"
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              spellCheck={false}
            />
            <div className="form-actions-bottom">
              <button className="btn btn-primary" onClick={handleSaveRawJson}>
                💾 Apply JSON
              </button>
              <button className="btn btn-ghost" onClick={() => setMode('visual')}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

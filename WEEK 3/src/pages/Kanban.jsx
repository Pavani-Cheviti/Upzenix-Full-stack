import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus, X } from 'lucide-react';

const initialData = {
  tasks: {
    'task-1': { id: 'task-1', content: 'Book tickets for Avengers' },
    'task-2': { id: 'task-2', content: 'Update movie database' },
    'task-3': { id: 'task-3', content: 'Process refunds' },
    'task-4': { id: 'task-4', content: 'Send promotional emails' },
    'task-5': { id: 'task-5', content: 'Review user feedback' },
    'task-6': { id: 'task-6', content: 'Update pricing' },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      taskIds: ['task-1', 'task-2', 'task-3'],
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      taskIds: ['task-4', 'task-5'],
    },
    'column-3': {
      id: 'column-3',
      title: 'Done',
      taskIds: ['task-6'],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3'],
};

const Task = ({ task, index, columnId, onDelete }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white dark:bg-gray-700 p-4 mb-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 group hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <p className="text-gray-900 dark:text-white flex-1">{task.content}</p>
            <button
              onClick={() => onDelete(task.id, columnId)}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

const Column = ({ column, tasks, onDeleteTask, addingToColumn, setAddingToColumn, newTaskContent, setNewTaskContent, handleAddTask }) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg w-80 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">{column.title}</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1 min-h-[200px]"
          >
            {tasks.map((task, index) => (
              <Task
                key={task.id}
                task={task}
                index={index}
                columnId={column.id}
                onDelete={onDeleteTask}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      {addingToColumn === column.id ? (
        <div className="mt-2">
          <textarea
            value={newTaskContent}
            onChange={(e) => setNewTaskContent(e.target.value)}
            placeholder="Enter task description..."
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
            rows="2"
            autoFocus
          />
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={() => {
                setAddingToColumn(null);
                setNewTaskContent('');
              }}
              className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={() => handleAddTask(column.id)}
              className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Add
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAddingToColumn(column.id)}
          className="mt-2 flex items-center justify-center w-full py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Task
        </button>
      )}
    </div>
  );
};

const Kanban = () => {
  const [data, setData] = useState(initialData);
  const [newTaskContent, setNewTaskContent] = useState('');
  const [addingToColumn, setAddingToColumn] = useState(null);

  const handleAddTask = (columnId) => {
    if (newTaskContent.trim()) {
      const newTaskId = `task-${Date.now()}`;
      const newTask = { id: newTaskId, content: newTaskContent.trim() };

      setData(prevData => ({
        ...prevData,
        tasks: {
          ...prevData.tasks,
          [newTaskId]: newTask,
        },
        columns: {
          ...prevData.columns,
          [columnId]: {
            ...prevData.columns[columnId],
            taskIds: [...prevData.columns[columnId].taskIds, newTaskId],
          },
        },
      }));

      setNewTaskContent('');
      setAddingToColumn(null);
    }
  };

  const handleDeleteTask = (taskId, columnId) => {
    setData(prevData => {
      const newTaskIds = prevData.columns[columnId].taskIds.filter(id => id !== taskId);
      const newTasks = { ...prevData.tasks };
      delete newTasks[taskId];

      return {
        ...prevData,
        tasks: newTasks,
        columns: {
          ...prevData.columns,
          [columnId]: {
            ...prevData.columns[columnId],
            taskIds: newTaskIds,
          },
        },
      };
    });
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newData = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      };

      setData(newData);
      return;
    }

    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newData = {
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    setData(newData);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Kanban Board</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-6 overflow-x-auto pb-4">
          {data.columnOrder.map((columnId) => {
            const column = data.columns[columnId];
            const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

            return (
              <Column
                key={column.id}
                column={column}
                tasks={tasks}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
                addingToColumn={addingToColumn}
                setAddingToColumn={setAddingToColumn}
                newTaskContent={newTaskContent}
                setNewTaskContent={setNewTaskContent}
                handleAddTask={handleAddTask}
              />
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Kanban;
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, Star } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import type { Project } from '../../types';
import { ProjectEditorModal } from './ProjectEditorModal';

interface ProjectsManagerProps {
  navigate: (path: string) => void;
}

export const ProjectsManager: React.FC<ProjectsManagerProps> = ({ navigate }) => {
  const { projects, deleteProject, updateProject } = useCMS();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showEditorModal, setShowEditorModal] = useState(false);

  const handleCreateNew = () => {
    setEditingProject(null);
    setShowEditorModal(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowEditorModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#D1C7BB]/15 pb-4">
        <div>
          <h3 className="font-editorial-heading font-black text-xl text-[#F2EDE4]">
            Projects & Apparel Case Studies ({projects.length})
          </h3>
          <p className="text-xs text-[#A99E92]">
            Add, edit, feature, draft, or delete clothing design case studies.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-5 py-2.5 bg-[#D1C7BB] text-[#101010] font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-[#F2EDE4] transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Project
        </button>
      </div>

      <div className="liquid-glass bg-[#171614] border border-[#D1C7BB]/15 rounded-sm overflow-x-auto">
        <table className="w-full text-left text-xs text-[#D1C7BB]">
          <thead className="bg-[#201C18] text-[#A99E92] uppercase tracking-wider text-[10px] border-b border-[#D1C7BB]/15">
            <tr>
              <th className="p-4">Project / Brand</th>
              <th className="p-4">Category</th>
              <th className="p-4">Year</th>
              <th className="p-4">Featured</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D1C7BB]/10">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-[#201C18]/50 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <img
                    src={project.finalDesigns.frontArtwork || project.mockups.heroMockup}
                    alt={project.title}
                    className="w-10 h-10 object-cover rounded bg-[#101010] border border-[#D1C7BB]/20"
                  />
                  <div>
                    <span className="block font-bold text-[#F2EDE4]">{project.title}</span>
                    <span className="block text-[10px] text-[#A99E92]">{project.brandName}</span>
                  </div>
                </td>
                <td className="p-4">{project.category}</td>
                <td className="p-4">{project.year}</td>
                <td className="p-4">
                  <button
                    onClick={() => updateProject(project.id, { isFeatured: !project.isFeatured })}
                    className={`p-1.5 rounded border transition-colors ${
                      project.isFeatured
                        ? 'border-[#D1C7BB] text-[#F2EDE4] bg-[#D1C7BB]/20'
                        : 'border-[#D1C7BB]/10 text-[#A99E92]'
                    }`}
                    title="Toggle Featured"
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded ${
                      project.isDraft
                        ? 'bg-[#201C18] text-[#A99E92] border border-[#3A332D]'
                        : 'bg-white/10 text-[#F2EDE4] border border-white/20'
                    }`}
                  >
                    {project.isDraft ? 'Draft' : 'Published'}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => navigate(`/work/${project.slug}`)}
                    className="p-2 border border-[#D1C7BB]/20 rounded text-[#D1C7BB] hover:text-[#F2EDE4] hover:border-[#D1C7BB]"
                    title="Preview Case Study"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleEdit(project)}
                    className="p-2 border border-[#D1C7BB]/20 rounded text-[#D1C7BB] hover:text-[#F2EDE4] hover:border-[#D1C7BB]"
                    title="Edit Case Study"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Delete project "${project.title}"?`)) {
                        deleteProject(project.id);
                      }
                    }}
                    className="p-2 border border-white/20 rounded text-[#F2EDE4] hover:bg-white/10"
                    title="Delete Case Study"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showEditorModal && (
        <ProjectEditorModal
          projectToEdit={editingProject}
          onClose={() => setShowEditorModal(false)}
        />
      )}
    </div>
  );
};


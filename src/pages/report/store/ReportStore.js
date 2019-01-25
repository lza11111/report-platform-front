import { observable, action } from 'mobx';
import request from '@/utils/request';

class ReportStore {

  @observable reportList = [];
  @observable reportTemplateList = [];

  @observable reportContent = {};
  @observable reportTitle = null;
  @observable reportUser = "";
  @observable reportId = 0;

  @observable templateContent = {};
  @observable templateUser = "";
  @observable templateId = 0;

  @action fetchReportList = () => {
    return request.get(`/api/reports/`)
      .then(res => {
        this.reportList = res;
      });
  }

  @action fetchReport = (id) => {
    return request.get(`/api/report/${id}`)
      .then(res => {
        this.reportContent = res.content;
        this.reportTitle = res.title;
        this.reportUser = res.user;
        this.reportId = res.id;
        this.templateId = res.templateId;
      });
  }

  @action fetchTemplate = (id) => {
    if (!id) id = this.templateId;
    return request.get(`/api/report-template/${id}`)
      .then(res => {
        this.templateContent = res.content;
        this.templateUser = res.user;
        this.templateId = res.id;
      });
  }

  @action fetchTemplateList = () => {
    return request.get(`/api/report-templates/`)
      .then(res => {
        this.reportTemplateList = res;
      });
  }

  @action updateReport = (content) => {
    return request.put(`/api/report/${this.reportId}`,{
      data: {
        content
      }
    }).then(res => {
        this.reportContent = res.content;
      })
  }

  @action addReport = (user, title,templateId, content) => {
    return request.post('/api/report/', {
      data: {
        user,
        title,
        templateId,
        content,
      }
    }).then(res => {
      this.reportContent = res.content;
      this.reportUser = res.user;
      this.reportTitle = res.title;
      this.reportId = res.id;
      this.templateId = res.templateId;
    })
  }

  @action deleteReport = (id) => {
    return request.delete(`/api/report/${id}`).then(() => {
      this.reportList = this.reportList.filter(report => report.id !== id)
    })
  }

  @action getThridPartyData = (url) => {
    return request.get(`/api/report/third_party?url=${url}`);
  }

  @action setReportTitle = (title) => {
    this.reportTitle = title.toString();
  }

  @action updateTemplate = (id, content) => {
    return request.put(`/api/report-template/${id}`,{
      data: {content},
    });
  }
}


export default new ReportStore();
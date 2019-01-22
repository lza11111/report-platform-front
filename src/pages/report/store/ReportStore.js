import { observable, action } from 'mobx';
import request from '@/utils/request';

class ReportStore {

  @observable reportList = [];

  @observable reportContent = {};
  @observable reportUser = "";
  @observable reportId = 0;

  @observable templateContent = {}
  @observable templateUser = "";
  @observable templattId = 0;

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
        this.reportUser = res.user;
        this.reportId = res.id;
      });
  }

  @action fetchTemplate = (id) => {
    return request.get(`/api/report-template/${id}`)
      .then(res => { 
        this.templateContent = res.content;
        this.templateUser = res.user;
        this.templattId = res.id;
      });
  }
}

export default new ReportStore();
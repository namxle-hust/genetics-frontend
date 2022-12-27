// tslint:disable:variable-name
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TableService } from 'src/app/shared/crud-table/services/table.service';
import { SampleModel } from '../models';
import { ApiService } from './api.service';

@Injectable()

export class SampleService extends TableService<SampleModel> {

    constructor(apiService: ApiService) {
        super('samples', apiService);

    }
}

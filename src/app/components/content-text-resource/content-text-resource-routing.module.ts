import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TextResourceComponent} from './text-resource/text-resource.component';
import {TextAssignmentComponent} from './text-assignment/text-assignment.component';
import {AddQuestionsComponent} from './add-questions/add-questions.component';
import {QuestionPageComponent} from './question-page/question-page.component';
import {PassageComponent} from './passage/passage.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'text-resource/:type',
                component: TextResourceComponent,
                data: {
                    title: 'Content Text Resource',
                    breadcrumb: 'Content Text Resource'
                }
            },
            {
                path: 'text-assignment/:type',
                component: TextAssignmentComponent,
                data: {
                    title: '',
                    breadcrumb: ''
                }
            },
            {
                path: 'add-questions/:type',
                component: AddQuestionsComponent,
                data: {
                    title: 'Questions',
                    breadcrumb: 'Questions'
                }
            },
            {
                path: 'question-paper/:type',
                component: QuestionPageComponent,
                data: {
                    title: 'Question Paper',
                    breadcrumb: 'Question Paper'
                }
            }, {
                path: 'passage',
                component: PassageComponent,
                data: {
                    title: 'Passage Details',
                    breadcrumb: 'Passage Details'
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContentTextResourceRoutingModule {
}

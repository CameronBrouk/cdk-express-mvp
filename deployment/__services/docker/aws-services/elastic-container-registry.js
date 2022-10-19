"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDockerRepo = void 0;
const aws_ecr_1 = require("aws-cdk-lib/aws-ecr");
const createDockerRepo = (scope, props) => {
    const repo = new aws_ecr_1.Repository(scope, `Repo`, {
        repositoryName: props.repoName,
        imageTagMutability: aws_ecr_1.TagMutability.MUTABLE,
        lifecycleRules: [
            {
                maxImageCount: 2,
                description: 'Only keep 2 images to stay under 500MB of ECR storage',
            },
        ],
    });
    return repo;
};
exports.createDockerRepo = createDockerRepo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxhc3RpYy1jb250YWluZXItcmVnaXN0cnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlbGFzdGljLWNvbnRhaW5lci1yZWdpc3RyeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpREFBK0Q7QUFTeEQsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLEtBQWdCLEVBQUUsS0FBWSxFQUFFLEVBQUU7SUFDakUsTUFBTSxJQUFJLEdBQUcsSUFBSSxvQkFBVSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7UUFDekMsY0FBYyxFQUFFLEtBQUssQ0FBQyxRQUFRO1FBQzlCLGtCQUFrQixFQUFFLHVCQUFhLENBQUMsT0FBTztRQUN6QyxjQUFjLEVBQUU7WUFDZDtnQkFDRSxhQUFhLEVBQUUsQ0FBQztnQkFDaEIsV0FBVyxFQUFFLHVEQUF1RDthQUNyRTtTQUNGO0tBQ0YsQ0FBQyxDQUFBO0lBRUYsT0FBTyxJQUFJLENBQUE7QUFDYixDQUFDLENBQUE7QUFiWSxRQUFBLGdCQUFnQixvQkFhNUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZXBvc2l0b3J5LCBUYWdNdXRhYmlsaXR5IH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjcidcbmltcG9ydCB7IENvbnRhaW5lckltYWdlIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjcydcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnXG5pbXBvcnQgeyBHSVRfQ09NTUlUX0hBU0ggfSBmcm9tICcuLi8uLi8uLi9jb25zdGFudHMnXG5cbnR5cGUgUHJvcHMgPSB7XG4gIHJlcG9OYW1lOiBzdHJpbmdcbn1cblxuZXhwb3J0IGNvbnN0IGNyZWF0ZURvY2tlclJlcG8gPSAoc2NvcGU6IENvbnN0cnVjdCwgcHJvcHM6IFByb3BzKSA9PiB7XG4gIGNvbnN0IHJlcG8gPSBuZXcgUmVwb3NpdG9yeShzY29wZSwgYFJlcG9gLCB7XG4gICAgcmVwb3NpdG9yeU5hbWU6IHByb3BzLnJlcG9OYW1lLFxuICAgIGltYWdlVGFnTXV0YWJpbGl0eTogVGFnTXV0YWJpbGl0eS5NVVRBQkxFLCAvLyBJbiBjYXNlIHdlIGZ1Y2sgdXAsIGRvbid0IHJlcGxhY2Ugc2hpdFxuICAgIGxpZmVjeWNsZVJ1bGVzOiBbXG4gICAgICB7XG4gICAgICAgIG1heEltYWdlQ291bnQ6IDIsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnT25seSBrZWVwIDIgaW1hZ2VzIHRvIHN0YXkgdW5kZXIgNTAwTUIgb2YgRUNSIHN0b3JhZ2UnLFxuICAgICAgfSxcbiAgICBdLFxuICB9KVxuXG4gIHJldHVybiByZXBvXG59XG4iXX0=
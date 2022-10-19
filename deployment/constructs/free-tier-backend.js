"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FreeTierBackend = void 0;
const aws_ecs_1 = require("aws-cdk-lib/aws-ecs");
const constructs_1 = require("constructs");
const constants_1 = require("../constants");
const relational_database_service_1 = require("../services/database/relational-database-service");
const elastic_container_registry_1 = require("../services/docker/aws-services/elastic-container-registry");
const task_definition_1 = require("../services/docker/aws-services/task-definition");
const route_53_1 = require("../services/domains/aws-services/route-53");
const cloudwatch_1 = require("../services/logging/aws-services/cloudwatch");
const virtual_private_cloud_1 = require("../services/network-security/aws-services/virtual-private-cloud");
const ecs_managed_1 = require("../services/server/aws-services/elastic-container-service/ecs-managed");
class FreeTierBackend extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        const vpc = (0, virtual_private_cloud_1.createVpc)(this, {
            identifier: 'Vpc',
            freeTier: true,
        });
        const databaseName = (0, relational_database_service_1.getDbName)(props.title, props.stage);
        const database = (0, relational_database_service_1.createDatabase)(this, {
            vpc,
            databaseName,
            instanceType: 't3.micro',
            subnetType: 'public',
        });
        const repo = (0, elastic_container_registry_1.createDockerRepo)(this, { repoName: 'swing-repo' });
        const image = aws_ecs_1.ContainerImage.fromEcrRepository(repo, constants_1.GIT_COMMIT_HASH);
        const taskDefinition = (0, task_definition_1.createTaskDefinition)(this, {
            secrets: (0, relational_database_service_1.getDbSecrets)(database.secret),
            environment: (0, relational_database_service_1.getDbEnvironment)(database, databaseName),
            image,
        });
        const { domainInfo } = (0, route_53_1.getDomains)(this, {
            domain: 'cameronbrouk.com',
        });
        const service = (0, ecs_managed_1.createEcsService)(this, {
            instanceType: 't3.micro',
            taskDefinition,
            vpc,
            domainInfo: domainInfo['api'],
        });
        database.connections.allowDefaultPortFrom(service.service);
        (0, cloudwatch_1.logCloudWatch)(this, 'api-url', service.loadBalancer.loadBalancerDnsName);
        (0, cloudwatch_1.logCloudWatch)(this, 'RepoName', repo.repositoryName);
        (0, cloudwatch_1.logCloudWatch)(this, 'ImageName', image.imageName);
    }
}
exports.FreeTierBackend = FreeTierBackend;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJlZS10aWVyLWJhY2tlbmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmcmVlLXRpZXItYmFja2VuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpREFBb0Q7QUFFcEQsMkNBQXNDO0FBQ3RDLDRDQUE4QztBQUM5QyxrR0FNeUQ7QUFDekQsMkdBQTZGO0FBQzdGLHFGQUFzRjtBQUt0Rix3RUFHa0Q7QUFDbEQsNEVBQTJFO0FBRTNFLDJHQUEyRjtBQUUzRix1R0FBd0c7QUFPeEcsTUFBYSxlQUFnQixTQUFRLHNCQUFTO0lBQzVDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBWTtRQUNwRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBRWhCLE1BQU0sR0FBRyxHQUFHLElBQUEsaUNBQVMsRUFBQyxJQUFJLEVBQUU7WUFDMUIsVUFBVSxFQUFFLEtBQUs7WUFDakIsUUFBUSxFQUFFLElBQUk7U0FDZixDQUFDLENBQUE7UUFFRixNQUFNLFlBQVksR0FBRyxJQUFBLHVDQUFTLEVBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDeEQsTUFBTSxRQUFRLEdBQUcsSUFBQSw0Q0FBYyxFQUFDLElBQUksRUFBRTtZQUNwQyxHQUFHO1lBQ0gsWUFBWTtZQUNaLFlBQVksRUFBRSxVQUFVO1lBQ3hCLFVBQVUsRUFBRSxRQUFRO1NBQ3JCLENBQUMsQ0FBQTtRQUVGLE1BQU0sSUFBSSxHQUFHLElBQUEsNkNBQWdCLEVBQUMsSUFBSSxFQUFFLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUE7UUFDL0QsTUFBTSxLQUFLLEdBQUcsd0JBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsMkJBQWUsQ0FBQyxDQUFBO1FBRXJFLE1BQU0sY0FBYyxHQUFHLElBQUEsc0NBQW9CLEVBQUMsSUFBSSxFQUFFO1lBQ2hELE9BQU8sRUFBRSxJQUFBLDBDQUFZLEVBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztZQUN0QyxXQUFXLEVBQUUsSUFBQSw4Q0FBZ0IsRUFBQyxRQUFRLEVBQUUsWUFBWSxDQUFDO1lBQ3JELEtBQUs7U0FDTixDQUFDLENBQUE7UUFFRixNQUFNLEVBQUUsVUFBVSxFQUFFLEdBQUcsSUFBQSxxQkFBVSxFQUFDLElBQUksRUFBRTtZQUN0QyxNQUFNLEVBQUUsa0JBQWtCO1NBQzNCLENBQUMsQ0FBQTtRQUVGLE1BQU0sT0FBTyxHQUFHLElBQUEsOEJBQWdCLEVBQUMsSUFBSSxFQUFFO1lBQ3JDLFlBQVksRUFBRSxVQUFVO1lBQ3hCLGNBQWM7WUFDZCxHQUFHO1lBQ0gsVUFBVSxFQUFFLFVBQVUsQ0FBQyxLQUFLLENBQUM7U0FDOUIsQ0FBQyxDQUFBO1FBRUYsUUFBUSxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7UUFFMUQsSUFBQSwwQkFBYSxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO1FBQ3hFLElBQUEsMEJBQWEsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQTtRQUNwRCxJQUFBLDBCQUFhLEVBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUE7SUFDbkQsQ0FBQztDQUNGO0FBM0NELDBDQTJDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnRhaW5lckltYWdlIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjcydcbmltcG9ydCB7IENka0NvbW1hbmQgfSBmcm9tICdhd3MtY2RrLWxpYi9jbG91ZC1hc3NlbWJseS1zY2hlbWEnXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJ1xuaW1wb3J0IHsgR0lUX0NPTU1JVF9IQVNIIH0gZnJvbSAnLi4vY29uc3RhbnRzJ1xuaW1wb3J0IHtcbiAgY3JlYXRlRGF0YWJhc2UsXG4gIGdldERiRW52aXJvbm1lbnQsXG4gIGdldERiTmFtZSxcbiAgZ2V0RGJTZWNyZXRKc29uLFxuICBnZXREYlNlY3JldHMsXG59IGZyb20gJy4uL3NlcnZpY2VzL2RhdGFiYXNlL3JlbGF0aW9uYWwtZGF0YWJhc2Utc2VydmljZSdcbmltcG9ydCB7IGNyZWF0ZURvY2tlclJlcG8gfSBmcm9tICcuLi9zZXJ2aWNlcy9kb2NrZXIvYXdzLXNlcnZpY2VzL2VsYXN0aWMtY29udGFpbmVyLXJlZ2lzdHJ5J1xuaW1wb3J0IHsgY3JlYXRlVGFza0RlZmluaXRpb24gfSBmcm9tICcuLi9zZXJ2aWNlcy9kb2NrZXIvYXdzLXNlcnZpY2VzL3Rhc2stZGVmaW5pdGlvbidcbmltcG9ydCB7XG4gIGNyZWF0ZUNlcnRpZmljYXRlLFxuICBnZW5lcmF0ZVNzbENlcnRpZmljYXRlLFxufSBmcm9tICcuLi9zZXJ2aWNlcy9kb21haW5zL2F3cy1zZXJ2aWNlcy9jZXJ0aWZpY2F0ZS1tYW5hZ2VyJ1xuaW1wb3J0IHtcbiAgZ2V0QXBpRG9tYWluLFxuICBnZXREb21haW5zLFxufSBmcm9tICcuLi9zZXJ2aWNlcy9kb21haW5zL2F3cy1zZXJ2aWNlcy9yb3V0ZS01MydcbmltcG9ydCB7IGxvZ0Nsb3VkV2F0Y2ggfSBmcm9tICcuLi9zZXJ2aWNlcy9sb2dnaW5nL2F3cy1zZXJ2aWNlcy9jbG91ZHdhdGNoJ1xuaW1wb3J0IHsgY3JlYXRlU2VjdXJpdHlHcm91cCB9IGZyb20gJy4uL3NlcnZpY2VzL25ldHdvcmstc2VjdXJpdHkvYXdzLXNlcnZpY2VzL3NlY3VyaXR5LWdyb3VwJ1xuaW1wb3J0IHsgY3JlYXRlVnBjIH0gZnJvbSAnLi4vc2VydmljZXMvbmV0d29yay1zZWN1cml0eS9hd3Mtc2VydmljZXMvdmlydHVhbC1wcml2YXRlLWNsb3VkJ1xuaW1wb3J0IHsgY3JlYXRlUm9sZSB9IGZyb20gJy4uL3NlcnZpY2VzL3Jlc291cmNlLXBlcm1pc3Npb25zL2F3cy1yZXNvdXJjZXMvaWRlbnRpdHktYWNjZXNzLW1hbmFnZW1lbnQnXG5pbXBvcnQgeyBjcmVhdGVFY3NTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvc2VydmVyL2F3cy1zZXJ2aWNlcy9lbGFzdGljLWNvbnRhaW5lci1zZXJ2aWNlL2Vjcy1tYW5hZ2VkJ1xuXG50eXBlIFByb3BzID0ge1xuICB0aXRsZTogc3RyaW5nXG4gIHN0YWdlOiAnRGV2JyB8ICdQcm9kJ1xufVxuXG5leHBvcnQgY2xhc3MgRnJlZVRpZXJCYWNrZW5kIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKVxuXG4gICAgY29uc3QgdnBjID0gY3JlYXRlVnBjKHRoaXMsIHtcbiAgICAgIGlkZW50aWZpZXI6ICdWcGMnLFxuICAgICAgZnJlZVRpZXI6IHRydWUsXG4gICAgfSlcblxuICAgIGNvbnN0IGRhdGFiYXNlTmFtZSA9IGdldERiTmFtZShwcm9wcy50aXRsZSwgcHJvcHMuc3RhZ2UpXG4gICAgY29uc3QgZGF0YWJhc2UgPSBjcmVhdGVEYXRhYmFzZSh0aGlzLCB7XG4gICAgICB2cGMsXG4gICAgICBkYXRhYmFzZU5hbWUsXG4gICAgICBpbnN0YW5jZVR5cGU6ICd0My5taWNybycsXG4gICAgICBzdWJuZXRUeXBlOiAncHVibGljJyxcbiAgICB9KVxuXG4gICAgY29uc3QgcmVwbyA9IGNyZWF0ZURvY2tlclJlcG8odGhpcywgeyByZXBvTmFtZTogJ3N3aW5nLXJlcG8nIH0pXG4gICAgY29uc3QgaW1hZ2UgPSBDb250YWluZXJJbWFnZS5mcm9tRWNyUmVwb3NpdG9yeShyZXBvLCBHSVRfQ09NTUlUX0hBU0gpXG5cbiAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IGNyZWF0ZVRhc2tEZWZpbml0aW9uKHRoaXMsIHtcbiAgICAgIHNlY3JldHM6IGdldERiU2VjcmV0cyhkYXRhYmFzZS5zZWNyZXQpLFxuICAgICAgZW52aXJvbm1lbnQ6IGdldERiRW52aXJvbm1lbnQoZGF0YWJhc2UsIGRhdGFiYXNlTmFtZSksXG4gICAgICBpbWFnZSxcbiAgICB9KVxuXG4gICAgY29uc3QgeyBkb21haW5JbmZvIH0gPSBnZXREb21haW5zKHRoaXMsIHtcbiAgICAgIGRvbWFpbjogJ2NhbWVyb25icm91ay5jb20nLFxuICAgIH0pXG5cbiAgICBjb25zdCBzZXJ2aWNlID0gY3JlYXRlRWNzU2VydmljZSh0aGlzLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6ICd0My5taWNybycsXG4gICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgIHZwYyxcbiAgICAgIGRvbWFpbkluZm86IGRvbWFpbkluZm9bJ2FwaSddLFxuICAgIH0pXG5cbiAgICBkYXRhYmFzZS5jb25uZWN0aW9ucy5hbGxvd0RlZmF1bHRQb3J0RnJvbShzZXJ2aWNlLnNlcnZpY2UpXG5cbiAgICBsb2dDbG91ZFdhdGNoKHRoaXMsICdhcGktdXJsJywgc2VydmljZS5sb2FkQmFsYW5jZXIubG9hZEJhbGFuY2VyRG5zTmFtZSlcbiAgICBsb2dDbG91ZFdhdGNoKHRoaXMsICdSZXBvTmFtZScsIHJlcG8ucmVwb3NpdG9yeU5hbWUpXG4gICAgbG9nQ2xvdWRXYXRjaCh0aGlzLCAnSW1hZ2VOYW1lJywgaW1hZ2UuaW1hZ2VOYW1lKVxuICB9XG59XG4iXX0=
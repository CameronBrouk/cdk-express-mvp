"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEndpointForService = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_elasticloadbalancingv2_1 = require("aws-cdk-lib/aws-elasticloadbalancingv2");
const createEndpointForService = (scope, props) => {
    const loadBalancer = new aws_elasticloadbalancingv2_1.ApplicationLoadBalancer(scope, 'LoadBalancer', {
        vpc: props.vpc,
        internetFacing: true,
    });
    const listener = loadBalancer.addListener('PublicListener', {
        port: 80,
        open: true,
    });
    const listenerTarget = listener.addTargets('ListenerTargets', {
        port: 80,
        // targets: [],
        targets: [props.service],
        // include health check (default is none)
        healthCheck: {
            interval: aws_cdk_lib_1.Duration.seconds(30),
            path: '/',
            timeout: aws_cdk_lib_1.Duration.seconds(5),
        },
    });
    return { loadBalancer, listener, listenerTarget };
};
exports.createEndpointForService = createEndpointForService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb24tbG9hZC1iYWxhbmNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcGxpY2F0aW9uLWxvYWQtYmFsYW5jZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkNBQXNDO0FBRXRDLHVGQUcrQztBQUd4QyxNQUFNLHdCQUF3QixHQUFHLENBQ3RDLEtBQWdCLEVBQ2hCLEtBR0MsRUFDRCxFQUFFO0lBQ0YsTUFBTSxZQUFZLEdBQUcsSUFBSSxvREFBdUIsQ0FBQyxLQUFLLEVBQUUsY0FBYyxFQUFFO1FBQ3RFLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztRQUNkLGNBQWMsRUFBRSxJQUFJO0tBQ3JCLENBQUMsQ0FBQTtJQUVGLE1BQU0sUUFBUSxHQUFHLFlBQVksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLEVBQUU7UUFDMUQsSUFBSSxFQUFFLEVBQUU7UUFDUixJQUFJLEVBQUUsSUFBSTtLQUNYLENBQUMsQ0FBQTtJQUVGLE1BQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLEVBQUU7UUFDNUQsSUFBSSxFQUFFLEVBQUU7UUFDUixlQUFlO1FBQ2YsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUN4Qix5Q0FBeUM7UUFDekMsV0FBVyxFQUFFO1lBQ1gsUUFBUSxFQUFFLHNCQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztZQUM5QixJQUFJLEVBQUUsR0FBRztZQUNULE9BQU8sRUFBRSxzQkFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7U0FDN0I7S0FDRixDQUFDLENBQUE7SUFFRixPQUFPLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxjQUFjLEVBQUUsQ0FBQTtBQUNuRCxDQUFDLENBQUE7QUE5QlksUUFBQSx3QkFBd0IsNEJBOEJwQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IER1cmF0aW9uIH0gZnJvbSAnYXdzLWNkay1saWInXG5pbXBvcnQgeyBWcGMgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJ1xuaW1wb3J0IHtcbiAgQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIsXG4gIElBcHBsaWNhdGlvbkxvYWRCYWxhbmNlclRhcmdldCxcbn0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWVsYXN0aWNsb2FkYmFsYW5jaW5ndjInXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJ1xuXG5leHBvcnQgY29uc3QgY3JlYXRlRW5kcG9pbnRGb3JTZXJ2aWNlID0gKFxuICBzY29wZTogQ29uc3RydWN0LFxuICBwcm9wczoge1xuICAgIHZwYzogVnBjXG4gICAgc2VydmljZTogSUFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyVGFyZ2V0XG4gIH0sXG4pID0+IHtcbiAgY29uc3QgbG9hZEJhbGFuY2VyID0gbmV3IEFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyKHNjb3BlLCAnTG9hZEJhbGFuY2VyJywge1xuICAgIHZwYzogcHJvcHMudnBjLFxuICAgIGludGVybmV0RmFjaW5nOiB0cnVlLFxuICB9KVxuXG4gIGNvbnN0IGxpc3RlbmVyID0gbG9hZEJhbGFuY2VyLmFkZExpc3RlbmVyKCdQdWJsaWNMaXN0ZW5lcicsIHtcbiAgICBwb3J0OiA4MCxcbiAgICBvcGVuOiB0cnVlLFxuICB9KVxuXG4gIGNvbnN0IGxpc3RlbmVyVGFyZ2V0ID0gbGlzdGVuZXIuYWRkVGFyZ2V0cygnTGlzdGVuZXJUYXJnZXRzJywge1xuICAgIHBvcnQ6IDgwLFxuICAgIC8vIHRhcmdldHM6IFtdLFxuICAgIHRhcmdldHM6IFtwcm9wcy5zZXJ2aWNlXSxcbiAgICAvLyBpbmNsdWRlIGhlYWx0aCBjaGVjayAoZGVmYXVsdCBpcyBub25lKVxuICAgIGhlYWx0aENoZWNrOiB7XG4gICAgICBpbnRlcnZhbDogRHVyYXRpb24uc2Vjb25kcygzMCksXG4gICAgICBwYXRoOiAnLycsXG4gICAgICB0aW1lb3V0OiBEdXJhdGlvbi5zZWNvbmRzKDUpLFxuICAgIH0sXG4gIH0pXG5cbiAgcmV0dXJuIHsgbG9hZEJhbGFuY2VyLCBsaXN0ZW5lciwgbGlzdGVuZXJUYXJnZXQgfVxufVxuIl19
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnimpairedStack = void 0;
const cdk = require("aws-cdk-lib");
const free_tier_backend_1 = require("../constructs/free-tier-backend");
class UnimpairedStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, {
            ...props,
            // env: {
            //   region: 'us-west-2',
            //   account: '941447230352',
            // },
            tags: {
                Project: 'StlSwingTestDeploy',
                DeployedBy: 'Cameron',
            },
        });
        new free_tier_backend_1.FreeTierBackend(this, 'SwingDev', { stage: 'Dev', title: 'Swing' });
    }
}
exports.UnimpairedStack = UnimpairedStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVW5pbXBhaXJlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlVuaW1wYWlyZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQWtDO0FBQ2xDLHVFQUFpRTtBQUVqRSxNQUFhLGVBQWdCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDNUMsWUFBWSxLQUFjLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzVELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ2YsR0FBRyxLQUFLO1lBQ1IsU0FBUztZQUNULHlCQUF5QjtZQUN6Qiw2QkFBNkI7WUFDN0IsS0FBSztZQUNMLElBQUksRUFBRTtnQkFDSixPQUFPLEVBQUUsb0JBQW9CO2dCQUM3QixVQUFVLEVBQUUsU0FBUzthQUN0QjtTQUNGLENBQUMsQ0FBQTtRQUVGLElBQUksbUNBQWUsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQTtJQUN6RSxDQUFDO0NBQ0Y7QUFoQkQsMENBZ0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJ1xuaW1wb3J0IHsgRnJlZVRpZXJCYWNrZW5kIH0gZnJvbSAnLi4vY29uc3RydWN0cy9mcmVlLXRpZXItYmFja2VuZCdcblxuZXhwb3J0IGNsYXNzIFVuaW1wYWlyZWRTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICAuLi5wcm9wcyxcbiAgICAgIC8vIGVudjoge1xuICAgICAgLy8gICByZWdpb246ICd1cy13ZXN0LTInLFxuICAgICAgLy8gICBhY2NvdW50OiAnOTQxNDQ3MjMwMzUyJyxcbiAgICAgIC8vIH0sXG4gICAgICB0YWdzOiB7XG4gICAgICAgIFByb2plY3Q6ICdTdGxTd2luZ1Rlc3REZXBsb3knLFxuICAgICAgICBEZXBsb3llZEJ5OiAnQ2FtZXJvbicsXG4gICAgICB9LFxuICAgIH0pXG5cbiAgICBuZXcgRnJlZVRpZXJCYWNrZW5kKHRoaXMsICdTd2luZ0RldicsIHsgc3RhZ2U6ICdEZXYnLCB0aXRsZTogJ1N3aW5nJyB9KVxuICB9XG59XG4iXX0=
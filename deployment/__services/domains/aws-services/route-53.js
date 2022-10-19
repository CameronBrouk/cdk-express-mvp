"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDomains = exports.getApiDomain = void 0;
const aws_certificatemanager_1 = require("aws-cdk-lib/aws-certificatemanager");
const aws_route53_1 = require("aws-cdk-lib/aws-route53");
const constants_1 = require("../../../constants");
const certificate_manager_1 = require("./certificate-manager");
const getApiDomain = (scope, props) => {
    const zone = new aws_route53_1.HostedZone(scope, 'HostedZone', {
        zoneName: props.domain,
    });
    const domainName = 'api.' + props.domain;
    const certificate = new aws_certificatemanager_1.Certificate(scope, 'Cert', {
        domainName,
        validation: aws_certificatemanager_1.CertificateValidation.fromDns(),
    });
    return { certificate, domainName, zone };
};
exports.getApiDomain = getApiDomain;
const getDomains = (scope, props) => {
    const zone = new aws_route53_1.HostedZone(scope, 'HostedZone', {
        zoneName: props.domain,
    });
    const certificate = (0, certificate_manager_1.generateSslCertificate)(scope, {
        domainName: props.domain,
        subDomains: constants_1.SUB_DOMAINS,
    });
    const domainInfo = constants_1.SUB_DOMAINS.reduce((domainInfo, curr) => {
        return {
            ...domainInfo,
            [curr]: {
                baseDomain: props.domain,
                zone: zone,
                domain: `${curr}.${props.domain}`,
                certificate: certificate,
            },
        };
    }, {});
    return { certificate, zone, domainInfo };
};
exports.getDomains = getDomains;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUtNTMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyb3V0ZS01My50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrRUFHMkM7QUFDM0MseURBQW9EO0FBRXBELGtEQUEyRDtBQUMzRCwrREFBOEQ7QUFZdkQsTUFBTSxZQUFZLEdBQUcsQ0FBQyxLQUFnQixFQUFFLEtBQXlCLEVBQUUsRUFBRTtJQUMxRSxNQUFNLElBQUksR0FBRyxJQUFJLHdCQUFVLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtRQUMvQyxRQUFRLEVBQUUsS0FBSyxDQUFDLE1BQU07S0FDdkIsQ0FBQyxDQUFBO0lBRUYsTUFBTSxVQUFVLEdBQUcsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUE7SUFFeEMsTUFBTSxXQUFXLEdBQUcsSUFBSSxvQ0FBVyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7UUFDakQsVUFBVTtRQUNWLFVBQVUsRUFBRSw4Q0FBcUIsQ0FBQyxPQUFPLEVBQUU7S0FDNUMsQ0FBQyxDQUFBO0lBRUYsT0FBTyxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUE7QUFDMUMsQ0FBQyxDQUFBO0FBYlksUUFBQSxZQUFZLGdCQWF4QjtBQUVNLE1BQU0sVUFBVSxHQUFHLENBQUMsS0FBZ0IsRUFBRSxLQUF5QixFQUFFLEVBQUU7SUFDeEUsTUFBTSxJQUFJLEdBQUcsSUFBSSx3QkFBVSxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7UUFDL0MsUUFBUSxFQUFFLEtBQUssQ0FBQyxNQUFNO0tBQ3ZCLENBQUMsQ0FBQTtJQUVGLE1BQU0sV0FBVyxHQUFHLElBQUEsNENBQXNCLEVBQUMsS0FBSyxFQUFFO1FBQ2hELFVBQVUsRUFBRSxLQUFLLENBQUMsTUFBTTtRQUN4QixVQUFVLEVBQUUsdUJBQVc7S0FDeEIsQ0FBQyxDQUFBO0lBRUYsTUFBTSxVQUFVLEdBQUcsdUJBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLEVBQUU7UUFDekQsT0FBTztZQUNMLEdBQUcsVUFBVTtZQUNiLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ04sVUFBVSxFQUFFLEtBQUssQ0FBQyxNQUFNO2dCQUN4QixJQUFJLEVBQUUsSUFBSTtnQkFDVixNQUFNLEVBQUUsR0FBRyxJQUFJLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTtnQkFDakMsV0FBVyxFQUFFLFdBQVc7YUFDekI7U0FDRixDQUFBO0lBQ0gsQ0FBQyxFQUFFLEVBQWdCLENBQUMsQ0FBQTtJQUVwQixPQUFPLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsQ0FBQTtBQUMxQyxDQUFDLENBQUE7QUF2QlksUUFBQSxVQUFVLGNBdUJ0QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENlcnRpZmljYXRlLFxuICBDZXJ0aWZpY2F0ZVZhbGlkYXRpb24sXG59IGZyb20gJ2F3cy1jZGstbGliL2F3cy1jZXJ0aWZpY2F0ZW1hbmFnZXInXG5pbXBvcnQgeyBIb3N0ZWRab25lIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLXJvdXRlNTMnXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJ1xuaW1wb3J0IHsgU3ViZG9tYWluLCBTVUJfRE9NQUlOUyB9IGZyb20gJy4uLy4uLy4uL2NvbnN0YW50cydcbmltcG9ydCB7IGdlbmVyYXRlU3NsQ2VydGlmaWNhdGUgfSBmcm9tICcuL2NlcnRpZmljYXRlLW1hbmFnZXInXG5cbmV4cG9ydCB0eXBlIERvbWFpbkluZm8gPSBSZWNvcmQ8XG4gIFN1YmRvbWFpbixcbiAge1xuICAgIGJhc2VEb21haW46IHN0cmluZ1xuICAgIHpvbmU6IEhvc3RlZFpvbmVcbiAgICBkb21haW46IGAke1N1YmRvbWFpbn0uJHtzdHJpbmd9YFxuICAgIGNlcnRpZmljYXRlOiBDZXJ0aWZpY2F0ZVxuICB9XG4+XG5cbmV4cG9ydCBjb25zdCBnZXRBcGlEb21haW4gPSAoc2NvcGU6IENvbnN0cnVjdCwgcHJvcHM6IHsgZG9tYWluOiBzdHJpbmcgfSkgPT4ge1xuICBjb25zdCB6b25lID0gbmV3IEhvc3RlZFpvbmUoc2NvcGUsICdIb3N0ZWRab25lJywge1xuICAgIHpvbmVOYW1lOiBwcm9wcy5kb21haW4sXG4gIH0pXG5cbiAgY29uc3QgZG9tYWluTmFtZSA9ICdhcGkuJyArIHByb3BzLmRvbWFpblxuXG4gIGNvbnN0IGNlcnRpZmljYXRlID0gbmV3IENlcnRpZmljYXRlKHNjb3BlLCAnQ2VydCcsIHtcbiAgICBkb21haW5OYW1lLFxuICAgIHZhbGlkYXRpb246IENlcnRpZmljYXRlVmFsaWRhdGlvbi5mcm9tRG5zKCksXG4gIH0pXG5cbiAgcmV0dXJuIHsgY2VydGlmaWNhdGUsIGRvbWFpbk5hbWUsIHpvbmUgfVxufVxuXG5leHBvcnQgY29uc3QgZ2V0RG9tYWlucyA9IChzY29wZTogQ29uc3RydWN0LCBwcm9wczogeyBkb21haW46IHN0cmluZyB9KSA9PiB7XG4gIGNvbnN0IHpvbmUgPSBuZXcgSG9zdGVkWm9uZShzY29wZSwgJ0hvc3RlZFpvbmUnLCB7XG4gICAgem9uZU5hbWU6IHByb3BzLmRvbWFpbixcbiAgfSlcblxuICBjb25zdCBjZXJ0aWZpY2F0ZSA9IGdlbmVyYXRlU3NsQ2VydGlmaWNhdGUoc2NvcGUsIHtcbiAgICBkb21haW5OYW1lOiBwcm9wcy5kb21haW4sXG4gICAgc3ViRG9tYWluczogU1VCX0RPTUFJTlMsXG4gIH0pXG5cbiAgY29uc3QgZG9tYWluSW5mbyA9IFNVQl9ET01BSU5TLnJlZHVjZSgoZG9tYWluSW5mbywgY3VycikgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5kb21haW5JbmZvLFxuICAgICAgW2N1cnJdOiB7XG4gICAgICAgIGJhc2VEb21haW46IHByb3BzLmRvbWFpbixcbiAgICAgICAgem9uZTogem9uZSxcbiAgICAgICAgZG9tYWluOiBgJHtjdXJyfS4ke3Byb3BzLmRvbWFpbn1gLFxuICAgICAgICBjZXJ0aWZpY2F0ZTogY2VydGlmaWNhdGUsXG4gICAgICB9LFxuICAgIH1cbiAgfSwge30gYXMgRG9tYWluSW5mbylcblxuICByZXR1cm4geyBjZXJ0aWZpY2F0ZSwgem9uZSwgZG9tYWluSW5mbyB9XG59XG4iXX0=